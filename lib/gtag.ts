declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const GTM_ID = 'GTM-T5P44NM';

interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

// https://developers.google.com/tag-platform/tag-manager/datalayer
export const pageview = (url: string): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'pageview', page: url });
};

export const event = ({ action, category, label, value }: GTagEvent): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: action,
    event_category: category,
    event_label: label,
    value: value,
  });
};
