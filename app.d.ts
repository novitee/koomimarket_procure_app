/// <reference types="nativewind/types" />
declare module '@env' {
  export const REACT_APP_API_URI: string;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {}
