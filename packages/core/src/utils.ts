export const privateReg = /^\_\w+$/;
export const parallelReg = /^\@\w+$/;
export const interceptionReg = /^\(\./;
export const groupReg = /^\(\w+\)$/;
export const exactNameReg = /^\w+$/;
export const exactSlugReg = /^\[(\w+)\]$/;
export const restSlugReg = /^\[\.\.\.(\w+)\]$/;
export const optionalRestSlugReg = /^\[\[\.\.\.(\w+)\]\]$/;

export const isPrivate = (segment: string) => privateReg.test(segment);

export const isParallel = (segment: string) => parallelReg.test(segment);

export const isInterception = (segment: string) =>
  interceptionReg.test(segment);

export const isGroup = (segment: string) => groupReg.test(segment);

export const isExactName = (segment: string) => exactNameReg.test(segment);

export const isExactSlug = (segment: string) => exactSlugReg.test(segment);

export const isRestSlug = (segment: string) => restSlugReg.test(segment);

export const isOptionalRestSlug = (segment: string) =>
  optionalRestSlugReg.test(segment);

export const mergeParams = (params: Record<string, any>[]) =>
  Object.assign({}, ...params);
