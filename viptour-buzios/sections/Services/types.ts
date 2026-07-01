export type ServicePrice = {
  label: string;
  value: string;
};

export type ServiceCard = {
  title: string;
  description: string;
  price: ServicePrice;
  note?: string;
  ctaLabel: string;
  href: string;
};
