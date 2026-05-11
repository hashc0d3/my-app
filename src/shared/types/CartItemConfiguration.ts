export type CartStrapItemConfiguration = {
  /** Для старых сохранённых корзин может отсутствовать — считается ремешком, если есть watch */
  productType?: "strap";
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

export type CartCaseItemConfiguration = {
  productType: "case";
  iphoneModelId: string;
  iphoneModelLabel: string;
  caseFormTypeId?: string;
  caseFormTypeLabel?: string;
  /** Раньше: открытая / закрытая форма — для старых записей в корзине */
  caseForm?: "open" | "closed";
  outsideColorId: string;
  outsideColorName: string;
  outsideHex: string;
  insideColorId: string;
  insideColorName: string;
  insideHex: string;
  personalizationNote?: string;
};

export type CartItemConfiguration = CartStrapItemConfiguration | CartCaseItemConfiguration;
