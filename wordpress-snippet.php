<?php
/**
 * Plugin Name: Salla Network Auth API
 * Description: WordPress authentication API for Salla Network app
 * Version: 1.0.0
 */

// منع الوصول المباشر
if (!defined('ABSPATH')) exit;

// 🔑 تعيين مفتاح API (يجب أن يتطابق مع VITE_API_KEY في التطبيق)
define('SALLA_API_KEY', 'your-secure-api-key-here'); // غيّر هذا المفتاح!

/**
 * تحقق من مفتاح API
 */
function salla_verify_api_key() {
    $api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
    
    if (empty($api_key) || $api_key !== SALLA_API_KEY) {
        return false;
    }
    
    return true;
}

/**
 * إنشاء JWT Token
 */
function salla_create_jwt($user_id) {
    $secret_key = wp_salt('auth');
    $issued_at = time();
    $expiration = $issued_at + (60 * 60 * 24 * 7); // صالح لمدة 7 أيام
    
    $payload = array(
        'iat' => $issued_at,
        'exp' => $expiration,
        'user_id' => $user_id
    );
    
    // إنشاء JWT بسيط (للإنتاج، استخدم مكتبة JWT)
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload_encoded = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', "$header.$payload_encoded", $secret_key, true);
    $signature_encoded = base64_encode($signature);
    
    return "$header.$payload_encoded.$signature_encoded";
}

/**
 * التحقق من JWT Token
 */
function salla_verify_jwt($token) {
    $secret_key = wp_salt('auth');
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload_encoded, $signature_provided) = $parts;
    
    // التحقق من التوقيع
    $signature = hash_hmac('sha256', "$header.$payload_encoded", $secret_key, true);
    $signature_encoded = base64_encode($signature);
    
    if ($signature_encoded !== $signature_provided) {
        return false;
    }
    
    // التحقق من انتهاء الصلاحية
    $payload = json_decode(base64_decode($payload_encoded), true);
    if ($payload['exp'] < time()) {
        return false;
    }
    
    return $payload['user_id'];
}

/**
 * نقطة API: تسجيل الدخول
 * POST /wp-json/auth/v1/login
 */
add_action('rest_api_init', function () {
    register_rest_route('auth/v1', '/login', array(
        'methods' => 'POST',
        'callback' => 'salla_api_login',
        'permission_callback' => '__return_true'
    ));
});

function salla_api_login($request) {
    // التحقق من API Key
    if (!salla_verify_api_key()) {
        return new WP_Error('invalid_api_key', 'Invalid API Key', array('status' => 403));
    }
    
    $params = $request->get_json_params();
    $username = sanitize_text_field($params['username'] ?? '');
    $password = $params['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        return new WP_Error('missing_credentials', 'Username and password are required', array('status' => 400));
    }
    
    // محاولة تسجيل الدخول
    $user = wp_authenticate($username, $password);
    
    if (is_wp_error($user)) {
        return new WP_Error('login_failed', 'Invalid username or password', array('status' => 401));
    }
    
    // إنشاء JWT Token
    $token = salla_create_jwt($user->ID);
    
    // إرجاع البيانات
    return rest_ensure_response(array(
        'success' => true,
        'token' => $token,
        'user' => array(
            'user_id' => $user->ID,
            'user_login' => $user->user_login,
            'user_email' => $user->user_email,
            'display_name' => $user->display_name
        )
    ));
}

/**
 * نقطة API: الحصول على بيانات المستخدم
 * GET /wp-json/auth/v1/user
 */
add_action('rest_api_init', function () {
    register_rest_route('auth/v1', '/user', array(
        'methods' => 'GET',
        'callback' => 'salla_api_get_user',
        'permission_callback' => '__return_true'
    ));
});

function salla_api_get_user($request) {
    // التحقق من API Key
    if (!salla_verify_api_key()) {
        return new WP_Error('invalid_api_key', 'Invalid API Key', array('status' => 403));
    }
    
    // الحصول على التوكن من الهيدر
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (empty($auth_header)) {
        return new WP_Error('no_token', 'Authorization token is required', array('status' => 401));
    }
    
    // استخراج التوكن
    $token = str_replace('Bearer ', '', $auth_header);
    
    // التحقق من التوكن
    $user_id = salla_verify_jwt($token);
    
    if (!$user_id) {
        return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
    }
    
    // الحصول على بيانات المستخدم
    $user = get_userdata($user_id);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'User not found', array('status' => 404));
    }
    
    // إرجاع البيانات
    return rest_ensure_response(array(
        'user_id' => $user->ID,
        'user_login' => $user->user_login,
        'user_email' => $user->user_email,
        'display_name' => $user->display_name
    ));
}

/**
 * السماح بـ CORS
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, X-API-Key, Content-Type');
        return $value;
    });
}, 15);
