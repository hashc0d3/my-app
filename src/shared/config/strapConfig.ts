import { StrapConfig } from '@/src/shared/types/StrapConfigTypes';

export const strapConfig: StrapConfig = {
  strapTypes: [
    {
      id: 'classic',
      label: 'Классический',
      step3Description:
        'Классический ремешок с акцентом на фактуру кожи и чистую геометрию шва. На этом шаге можно настроить материал и фурнитуру под повседневный или более строгий стиль.',
      defaultImages: {
        front: '/StrapModels/Configurator/classic/default_front.png',
        side: '/StrapModels/Configurator/classic/default_side.png',
        back: '/StrapModels/Configurator/classic/default_back.png',
      },
      leatherTypes: [
        {
          id: 'smooth',
          label: 'Гладкая',
          leatherColors: [
            {
              id: 'black',
              label: 'Чёрный',
              hex: '#1a1a1a',
              layers: {
                front: '/StrapModels/Configurator/classic/leather/smooth_black_front.png',
                side: '/StrapModels/Configurator/classic/leather/smooth_black_side.png',
                back: '/StrapModels/Configurator/classic/leather/smooth_black_back.png',
              },
            },
            {
              id: 'brown',
              label: 'Коричневый',
              hex: '#7a4e2f',
              layers: {
                front: '/StrapModels/Configurator/classic/leather/smooth_brown_front.png',
                side: '/StrapModels/Configurator/classic/leather/smooth_brown_side.png',
                back: '/StrapModels/Configurator/classic/leather/smooth_brown_back.png',
              },
            },
            {
              id: 'blue',
              label: 'Синий',
              hex: '#2d416d',
              layers: {
                front: '/StrapModels/Configurator/classic/leather/smooth_blue_front.png',
                side: '/StrapModels/Configurator/classic/leather/smooth_blue_side.png',
                back: '/StrapModels/Configurator/classic/leather/smooth_blue_back.png',
              },
            },
          ],
          edgeTypes: [
            {
              id: 'rounded',
              label: 'Скруглённый',
              layers: {
                front: '/StrapModels/Configurator/classic/edge/rounded_front.png',
                side: '/StrapModels/Configurator/classic/edge/rounded_side.png',
                back: '/StrapModels/Configurator/classic/edge/rounded_back.png',
              },
            },
            {
              id: 'flat',
              label: 'Плоский',
              layers: {
                front: '/StrapModels/Configurator/classic/edge/flat_front.png',
                side: '/StrapModels/Configurator/classic/edge/flat_side.png',
                back: '/StrapModels/Configurator/classic/edge/flat_back.png',
              },
            },
          ],
          stitchTypes: [
            {
              id: 'single',
              label: 'Одинарная',
              layers: {
                front: '/StrapModels/Configurator/classic/stitch/single_front.png',
                side: '/StrapModels/Configurator/classic/stitch/single_side.png',
                back: '/StrapModels/Configurator/classic/stitch/single_back.png',
              },
            },
            {
              id: 'contrast',
              label: 'Контрастная',
              layers: {
                front: '/StrapModels/Configurator/classic/stitch/contrast_front.png',
                side: '/StrapModels/Configurator/classic/stitch/contrast_side.png',
                back: '/StrapModels/Configurator/classic/stitch/contrast_back.png',
              },
            },
          ],
        },
        {
          id: 'grain',
          label: 'Зернистая',
          leatherColors: [
            {
              id: 'graphite',
              label: 'Графит',
              hex: '#3a3d42',
              layers: {
                front: '/StrapModels/Configurator/classic/leather/grain_graphite_front.png',
                side: '/StrapModels/Configurator/classic/leather/grain_graphite_side.png',
                back: '/StrapModels/Configurator/classic/leather/grain_graphite_back.png',
              },
            },
            {
              id: 'olive',
              label: 'Оливковый',
              hex: '#5e6343',
              layers: {
                front: '/StrapModels/Configurator/classic/leather/grain_olive_front.png',
                side: '/StrapModels/Configurator/classic/leather/grain_olive_side.png',
                back: '/StrapModels/Configurator/classic/leather/grain_olive_back.png',
              },
            },
          ],
          edgeTypes: [
            {
              id: 'painted',
              label: 'Окрашенный',
              layers: {
                front: '/StrapModels/Configurator/classic/edge/painted_front.png',
                side: '/StrapModels/Configurator/classic/edge/painted_side.png',
                back: '/StrapModels/Configurator/classic/edge/painted_back.png',
              },
            },
            {
              id: 'raw',
              label: 'Натуральный',
              layers: {
                front: '/StrapModels/Configurator/classic/edge/raw_front.png',
                side: '/StrapModels/Configurator/classic/edge/raw_side.png',
                back: '/StrapModels/Configurator/classic/edge/raw_back.png',
              },
            },
          ],
          stitchTypes: [
            {
              id: 'double',
              label: 'Двойная',
              layers: {
                front: '/StrapModels/Configurator/classic/stitch/double_front.png',
                side: '/StrapModels/Configurator/classic/stitch/double_side.png',
                back: '/StrapModels/Configurator/classic/stitch/double_back.png',
              },
            },
            {
              id: 'hidden',
              label: 'Скрытая',
              layers: {
                front: '/StrapModels/Configurator/classic/stitch/hidden_front.png',
                side: '/StrapModels/Configurator/classic/stitch/hidden_side.png',
                back: '/StrapModels/Configurator/classic/stitch/hidden_back.png',
              },
            },
          ],
        },
      ],
      buckleColors: {
        hasButterfly: true,
        options: [
          {
            id: 'silver',
            label: 'Серебро',
            hex: '#c0c0c0',
            layers: {
              standard: {
                front: '/StrapModels/Configurator/classic/buckle/standard_silver_front.png',
                side: '/StrapModels/Configurator/classic/buckle/standard_silver_side.png',
                back: '/StrapModels/Configurator/classic/buckle/standard_silver_back.png',
              },
              butterfly: {
                front: '/StrapModels/Configurator/classic/buckle/butterfly_silver_front.png',
                side: '/StrapModels/Configurator/classic/buckle/butterfly_silver_side.png',
                back: '/StrapModels/Configurator/classic/buckle/butterfly_silver_back.png',
              },
            },
          },
          {
            id: 'black',
            label: 'Чёрный',
            hex: '#2b2b2b',
            layers: {
              standard: {
                front: '/StrapModels/Configurator/classic/buckle/standard_black_front.png',
                side: '/StrapModels/Configurator/classic/buckle/standard_black_side.png',
                back: '/StrapModels/Configurator/classic/buckle/standard_black_back.png',
              },
              butterfly: {
                front: '/StrapModels/Configurator/classic/buckle/butterfly_black_front.png',
                side: '/StrapModels/Configurator/classic/buckle/butterfly_black_side.png',
                back: '/StrapModels/Configurator/classic/buckle/butterfly_black_back.png',
              },
            },
          },
        ],
      },
      adapterColors: [
        {
          id: 'silver',
          label: 'Серебро',
          hex: '#c0c0c0',
          layers: {
            front: '/StrapModels/Configurator/classic/adapter/silver_front.png',
            side: '/StrapModels/Configurator/classic/adapter/silver_side.png',
            back: '/StrapModels/Configurator/classic/adapter/silver_back.png',
          },
        },
        {
          id: 'black',
          label: 'Чёрный',
          hex: '#2b2b2b',
          layers: {
            front: '/StrapModels/Configurator/classic/adapter/black_front.png',
            side: '/StrapModels/Configurator/classic/adapter/black_side.png',
            back: '/StrapModels/Configurator/classic/adapter/black_back.png',
          },
        },
      ],
    },
    {
      id: 'butterfly',
      label: 'Butterfly',
      step3Description:
        'Butterfly-модель с более выразительной фурнитурой и посадкой. На этом шаге подберите сочетание кожи, края, строчки и застёжки для более премиального вида.',
      defaultImages: {
        front: '/StrapModels/Configurator/butterfly/default_front.png',
        side: '/StrapModels/Configurator/butterfly/default_side.png',
        back: '/StrapModels/Configurator/butterfly/default_back.png',
      },
      leatherTypes: [
        {
          id: 'nubuck',
          label: 'Нубук',
          leatherColors: [
            {
              id: 'sand',
              label: 'Песочный',
              hex: '#b8a486',
              layers: {
                front: '/StrapModels/Configurator/butterfly/leather/nubuck_sand_front.png',
                side: '/StrapModels/Configurator/butterfly/leather/nubuck_sand_side.png',
                back: '/StrapModels/Configurator/butterfly/leather/nubuck_sand_back.png',
              },
            },
            {
              id: 'charcoal',
              label: 'Угольный',
              hex: '#3d3a39',
              layers: {
                front: '/StrapModels/Configurator/butterfly/leather/nubuck_charcoal_front.png',
                side: '/StrapModels/Configurator/butterfly/leather/nubuck_charcoal_side.png',
                back: '/StrapModels/Configurator/butterfly/leather/nubuck_charcoal_back.png',
              },
            },
          ],
          edgeTypes: [
            {
              id: 'waxed',
              label: 'Вощёный',
              layers: {
                front: '/StrapModels/Configurator/butterfly/edge/waxed_front.png',
                side: '/StrapModels/Configurator/butterfly/edge/waxed_side.png',
                back: '/StrapModels/Configurator/butterfly/edge/waxed_back.png',
              },
            },
            {
              id: 'clean',
              label: 'Чистый',
              layers: {
                front: '/StrapModels/Configurator/butterfly/edge/clean_front.png',
                side: '/StrapModels/Configurator/butterfly/edge/clean_side.png',
                back: '/StrapModels/Configurator/butterfly/edge/clean_back.png',
              },
            },
          ],
          stitchTypes: [
            {
              id: 'single',
              label: 'Одинарная',
              layers: {
                front: '/StrapModels/Configurator/butterfly/stitch/single_front.png',
                side: '/StrapModels/Configurator/butterfly/stitch/single_side.png',
                back: '/StrapModels/Configurator/butterfly/stitch/single_back.png',
              },
            },
            {
              id: 'contrast',
              label: 'Контрастная',
              layers: {
                front: '/StrapModels/Configurator/butterfly/stitch/contrast_front.png',
                side: '/StrapModels/Configurator/butterfly/stitch/contrast_side.png',
                back: '/StrapModels/Configurator/butterfly/stitch/contrast_back.png',
              },
            },
          ],
        },
        {
          id: 'saffiano',
          label: 'Сафьяно',
          leatherColors: [
            {
              id: 'red',
              label: 'Красный',
              hex: '#a8242d',
              layers: {
                front: '/StrapModels/Configurator/butterfly/leather/saffiano_red_front.png',
                side: '/StrapModels/Configurator/butterfly/leather/saffiano_red_side.png',
                back: '/StrapModels/Configurator/butterfly/leather/saffiano_red_back.png',
              },
            },
            {
              id: 'navy',
              label: 'Тёмно-синий',
              hex: '#1d2f59',
              layers: {
                front: '/StrapModels/Configurator/butterfly/leather/saffiano_navy_front.png',
                side: '/StrapModels/Configurator/butterfly/leather/saffiano_navy_side.png',
                back: '/StrapModels/Configurator/butterfly/leather/saffiano_navy_back.png',
              },
            },
            {
              id: 'cream',
              label: 'Кремовый',
              hex: '#ddd2bd',
              layers: {
                front: '/StrapModels/Configurator/butterfly/leather/saffiano_cream_front.png',
                side: '/StrapModels/Configurator/butterfly/leather/saffiano_cream_side.png',
                back: '/StrapModels/Configurator/butterfly/leather/saffiano_cream_back.png',
              },
            },
          ],
          edgeTypes: [
            {
              id: 'rounded',
              label: 'Скруглённый',
              layers: {
                front: '/StrapModels/Configurator/butterfly/edge/rounded_front.png',
                side: '/StrapModels/Configurator/butterfly/edge/rounded_side.png',
                back: '/StrapModels/Configurator/butterfly/edge/rounded_back.png',
              },
            },
            {
              id: 'painted',
              label: 'Окрашенный',
              layers: {
                front: '/StrapModels/Configurator/butterfly/edge/painted_front.png',
                side: '/StrapModels/Configurator/butterfly/edge/painted_side.png',
                back: '/StrapModels/Configurator/butterfly/edge/painted_back.png',
              },
            },
          ],
          stitchTypes: [
            {
              id: 'hidden',
              label: 'Скрытая',
              layers: {
                front: '/StrapModels/Configurator/butterfly/stitch/hidden_front.png',
                side: '/StrapModels/Configurator/butterfly/stitch/hidden_side.png',
                back: '/StrapModels/Configurator/butterfly/stitch/hidden_back.png',
              },
            },
            {
              id: 'double',
              label: 'Двойная',
              layers: {
                front: '/StrapModels/Configurator/butterfly/stitch/double_front.png',
                side: '/StrapModels/Configurator/butterfly/stitch/double_side.png',
                back: '/StrapModels/Configurator/butterfly/stitch/double_back.png',
              },
            },
          ],
        },
      ],
      buckleColors: {
        hasButterfly: true,
        options: [
          {
            id: 'steel',
            label: 'Сталь',
            hex: '#b7bec7',
            layers: {
              standard: {
                front: '/StrapModels/Configurator/butterfly/buckle/standard_steel_front.png',
                side: '/StrapModels/Configurator/butterfly/buckle/standard_steel_side.png',
                back: '/StrapModels/Configurator/butterfly/buckle/standard_steel_back.png',
              },
              butterfly: {
                front: '/StrapModels/Configurator/butterfly/buckle/butterfly_steel_front.png',
                side: '/StrapModels/Configurator/butterfly/buckle/butterfly_steel_side.png',
                back: '/StrapModels/Configurator/butterfly/buckle/butterfly_steel_back.png',
              },
            },
          },
          {
            id: 'gold',
            label: 'Золото',
            hex: '#c6a15b',
            layers: {
              standard: {
                front: '/StrapModels/Configurator/butterfly/buckle/standard_gold_front.png',
                side: '/StrapModels/Configurator/butterfly/buckle/standard_gold_side.png',
                back: '/StrapModels/Configurator/butterfly/buckle/standard_gold_back.png',
              },
              butterfly: {
                front: '/StrapModels/Configurator/butterfly/buckle/butterfly_gold_front.png',
                side: '/StrapModels/Configurator/butterfly/buckle/butterfly_gold_side.png',
                back: '/StrapModels/Configurator/butterfly/buckle/butterfly_gold_back.png',
              },
            },
          },
        ],
      },
      adapterColors: [
        {
          id: 'steel',
          label: 'Сталь',
          hex: '#b7bec7',
          layers: {
            front: '/StrapModels/Configurator/butterfly/adapter/steel_front.png',
            side: '/StrapModels/Configurator/butterfly/adapter/steel_side.png',
            back: '/StrapModels/Configurator/butterfly/adapter/steel_back.png',
          },
        },
        {
          id: 'gold',
          label: 'Золото',
          hex: '#c6a15b',
          layers: {
            front: '/StrapModels/Configurator/butterfly/adapter/gold_front.png',
            side: '/StrapModels/Configurator/butterfly/adapter/gold_side.png',
            back: '/StrapModels/Configurator/butterfly/adapter/gold_back.png',
          },
        },
      ],
    },
  ],
};
