export type IphoneModelOption = {
  id: string;
  label: string;
};

/** Три кадра превью (главная + 2 миниатюры), как в конструкторе ремешков */
export type PhoneCaseBasePreview = {
  previewMain: string;
  previewThumb1: string;
  previewThumb2: string;
};

/** Один цвет из палитры + три изображения для превью */
export type PhoneCaseColorVariant = {
  colorId: string;
  image1: string;
  image2: string;
  image3: string;
};

export type PhoneCaseFormType = {
  id: string;
  label: string;
  /** Своя цена для этого типа формы */
  price: number;
  basePreview: PhoneCaseBasePreview;
  outsideVariants: PhoneCaseColorVariant[];
  insideVariants: PhoneCaseColorVariant[];
};

/** Конфигуратор чехлов: модели iPhone, типы формы с ценой и превью по цветам из вкладки «Цвета» */
export type PhoneCaseConfig = {
  iphoneModels: IphoneModelOption[];
  formTypes: PhoneCaseFormType[];
};
