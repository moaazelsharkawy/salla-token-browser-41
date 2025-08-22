import { useTranslation } from 'react-i18next';
import { IconWithLogo } from './IconWithLogo';
import { AppIcon } from './AppIcon';

export function AppGrid() {
  const { t } = useTranslation();

  const apps = [
    { type: 'mining', key: 'mining', href: 'https://salla-shop.com/mining', useCustomIcon: false },
    { type: 'deposit', key: 'deposit', href: 'https://salla-shop.com/st-deposit/', useCustomIcon: true, image: '/lovable-uploads/5efbad70-8c28-42f4-999a-e33ba97dd136.png' },
    { type: 'withdraw', key: 'withdraw', href: 'https://salla-shop.com/st-withdraw/', useCustomIcon: true, image: '/lovable-uploads/9a245025-bc13-4de6-9593-eab6ec20ac92.png' },
    { type: 'transfer', key: 'transfer', href: 'https://salla-shop.com/st-transfer/', useCustomIcon: true, image: '/lovable-uploads/8532e579-cb11-4528-89ba-5111bdb13006.png' },
    { type: 'payRequest', key: 'payRequest', href: 'https://salla-shop.com/st-pay-request/', useCustomIcon: true, image: '/lovable-uploads/ddaaf2cb-9091-4ea0-86ed-115a98c4cf52.png' },
    { type: 'escrow', key: 'escrow', href: 'https://salla-shop.com/st-escrow/', useCustomIcon: true, image: '/lovable-uploads/5a533289-5d36-4788-bfcd-c3ab0b3eb88b.png' },
    { type: 'explorer', key: 'explorer', href: 'https://salla-shop.com/st-explorer/', useCustomIcon: true, image: '/lovable-uploads/832e9ce6-d367-4ff8-9148-212144eccca8.png' },
    { type: 'swap', key: 'swap', href: 'https://salla-shop.com/pi-swap/', useCustomIcon: true, image: '/lovable-uploads/bf1e7843-c5c5-4cfb-b2ae-835a9b40b952.png' },
    { type: 'virtualCards', key: 'virtualCards', href: 'https://salla-shop.com/st-vc/', useCustomIcon: true, image: '/lovable-uploads/28ed21c9-2da4-4633-9ed1-f2478e57902d.png' },
    { type: 'developerApi', key: 'developerApi', href: 'https://salla-shop.com/salla-developer/', useCustomIcon: true, image: '/lovable-uploads/9fbe103d-21f9-4b2b-8cd4-beb6cc579a0f.png' },
    { type: 'commerce', key: 'commerce', href: 'https://salla-shop.com/st-e-commerce/', useCustomIcon: true, image: '/lovable-uploads/d61dec61-2cf6-45c2-96cb-1f1a964c5bff.png' },
    { type: 'p2p', key: 'p2p', href: 'https://salla-shop.com/st-p2p/', useCustomIcon: true, image: '/lovable-uploads/f5abe280-f5e6-4350-b2f9-c09e975fffa8.png' },
    { type: 'kyc', key: 'kyc', href: 'https://salla-shop.com/kyc/', useCustomIcon: true, image: '/lovable-uploads/28d7ec75-6696-429d-83ec-c126abb7649a.png' },
    { type: 'social', key: 'social', href: 'https://salla-shop.com/decentralized-voting/', useCustomIcon: true, image: '/lovable-uploads/0f58b5a4-7450-4ddc-ba87-99c69dee259a.png' },
    { type: 'coupons', key: 'coupons', href: 'https://salla-shop.com/st-coupons/', useCustomIcon: true, image: '/lovable-uploads/1856b522-d775-4363-82c7-b94fd9a10fd4.png' },
    { type: 'piMall', key: 'piMall', href: 'https://salla-shop.com', useCustomIcon: false }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 p-6 max-w-md mx-auto">
      {apps.map((app, index) => (
        app.useCustomIcon ? (
          <AppIcon
            key={app.key}
            image={app.image!}
            label={t(`apps.${app.key}`)}
            href={app.href}
          />
        ) : (
          <IconWithLogo
            key={app.key}
            type={app.type}
            label={t(`apps.${app.key}`)}
            href={app.href}
          />
        )
      ))}
    </div>
  );
}