import { useEffect } from "react";

export const useMountEffect = (fun: any) => useEffect(fun, []);
