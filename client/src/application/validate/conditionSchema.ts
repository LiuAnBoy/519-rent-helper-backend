import * as yup from 'yup';

const validationSchema = yup.object({
  region: yup.string().required('請選擇地區'),
  section: yup.array().max(5, '地區最多不能超過5個').required('請選擇位置'),
  min_price: yup
    .string()
    .matches(/^[0-9]*$/, '請輸入數字')
    .test({
      name: 'max_price',
      message: '最小租金不能大於最大租金',
      test: function (value) {
        const { max_price } = this.parent;
        if (value && max_price) {
          if (parseInt(value) > parseInt(max_price)) {
            return false;
          }
        }
        return true;
      },
    }),
  max_price: yup.string().matches(/^[0-9]*$/, '請輸入數字'),
  min_area: yup
    .string()
    .matches(/^[0-9]*$/, '請輸入數字')
    .test({
      name: 'max_price',
      message: '最小坪數不能大於最大坪數',
      test: function (value) {
        const { max_area } = this.parent;
        if (value && max_area) {
          if (parseInt(value) > parseInt(max_area)) {
            return false;
          }
        }
        return true;
      },
    }),
  max_area: yup.string().matches(/^[0-9]*$/, '請輸入數字'),
});

export default validationSchema;