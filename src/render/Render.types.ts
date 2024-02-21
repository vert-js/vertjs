export type RenderEnv = {
  SRC?: string;
  DIST?: string;
  STATIC?: string;
};

export type RenderTransformation = {
  file: string;
  original: string;
  final: string;
};
