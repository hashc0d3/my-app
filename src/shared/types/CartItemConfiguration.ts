export type CartItemConfiguration = {
  watch: {
    watchModelId: number;
    watchModelName: string;
    watchSize: number;
    watchColorHex: string;
    watchColorName: string;
  };
  strap: {
    strapModelId: number;
    strapModelName: string;
    strapModelPrice: number;
  };
  step3: {
    strapTypeId: string;
    leatherTypeId: string;
    leatherColorId: string;
    edgeTypeId: string;
    stitchTypeId: string;
    buckleColorId: string;
    buckleVariant: "standard" | "butterfly";
    adapterColorId: string;
  };
  step4: {
    wristOptionId: string;
    addonCardIds: string[];
  };
};
