/// <reference types="react-scripts" />

declare module "material-auto-rotating-carousel" {
  interface IAutoRotatingCarouselProps {
    label?: string;
    open: boolean;
    autoplay?: boolean;
    onClose: () => void;
    style: React.CSSProperties;
    classes?: {
      footer?: string;
      footerMobile?: string;
      footerMobileLandscape?: string;

      dots?: string;
      dotsMobile?: string;
      dotsMobileLandscape?: string;
    };
  }

  export function AutoRotatingCarousel(
    props: React.PropsWithChildren<IAutoRotatingCarouselProps>
  ): JSX.Element;

  export function Slide(props: {
    media: React.ReactNode;
    classes?: {
      root: string;
      text: string;
      media: string;
      title: string;
      subtitle: string;
      rootMobile: string;
      textMobile: string;
      mediaMobile: string;
      mediaBackground: string;
      textMobileLandscape: string;
      rootMobileLandscape: string;
      mediaMobileLandscape: string;
    };
    title: string;
    subtitle: string;
    mobile?: boolean;
    landscape?: boolean;
    style?: React.CSSProperties;
    mediaBackgroundStyle?: React.CSSProperties;
  }): JSX.Element;
}
