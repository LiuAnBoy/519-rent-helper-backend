import React, { useContext, useEffect } from 'react';
import { Box, Button, Grid, Switch } from '@mui/material';
import { Formik, Form } from 'formik';

import SectionDropdown from '../../presentation/component/SectionSection';
import RegionDropdown from '../../presentation/component/RegionSection';
import KindDropdown from '../../presentation/component/KindSection';
import PriceDropdown from '../../presentation/component/PriceSection';
import MultiRoomDropdown from '../../presentation/component/MultiRoomSection';
import OtherDropdown from '../../presentation/component/OtherSection';
import ShapeDropdown from '../../presentation/component/ShapeSection';
import MultiAreaSection from '../../presentation/component/MultiAreaSection';
import OptionSection from '../../presentation/component/OptionSeciton';
import MultiNoticeSection from '../../presentation/component/MultiNoticeSection';
import {
  ConditionContext,
  ConditionContextProps,
  ConditionResponseProps,
} from '../../application/hook/useCondition';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ProfileContextProps,
  UserContext,
} from '../../application/hook/useUser';

import FloorSection from '../../presentation/component/FloorSection';
import useCondition from '../../application/hook/useCondition';
import validationSchema from '../../application/validate/conditionSchema';
import useSnackBar from '../../application/hook/useSnackBar';
import NameSection from '../../presentation/component/NameSection';
import ConfirmModal from '../../presentation/component/ConfirmModal';

const conditionDict: { [key: number]: string } = {
  0: '一',
  1: '二',
  2: '三',
  3: '四',
  4: '五',
};

const ConditionCreatePage = () => {
  const navigator = useNavigate();
  const { showSnackBar } = useSnackBar();
  const { user } = useContext(UserContext) as ProfileContextProps;
  const { conditionList } = useContext(
    ConditionContext
  ) as ConditionContextProps;
  const {
    requestCreateCondition,
    condition,
    requestChangePush,
    requestUpdateCondition,
  } = useCondition();


  const handleSubmit = async (values: any) => {
    const data = {
      ...values,
      user_id: user._id,
      name: values.name || `第${conditionDict[conditionList.length]}組條件`,
    };

    try {
      if (condition._id) {
        const res = await requestUpdateCondition(data);
        return showSnackBar(res as ConditionResponseProps);
      }
      const res = await requestCreateCondition(data);
      return showSnackBar(res as ConditionResponseProps);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user.condition >= 3) {
      return navigator('/', {
        state: { success: false, message: '條件數量已達上限' },
      });
    }
  }, [user.condition]);

  return (
    <Box component='div' sx={{ pb: 3 }}>
      <Formik
        enableReinitialize
        initialValues={condition}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {({ handleChange, errors, values, setFieldValue }) => {
          const handleFieldChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            module: string
          ) => {
            const { checked } = e.target;
            if (e.target.name === '0') {
              if (checked) {
                return setFieldValue(module, []);
              }
            }
            if (!checked) {
              return setFieldValue(
                module,
                (values[module as keyof typeof condition] as string[]).filter(
                  value => value !== e.target.name
                )
              );
            }
            return setFieldValue(
              module,
              (values[module as keyof typeof condition] as string[]).concat(
                e.target.name
              )
            );
          };

          const handlePriceFieldChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            module: string
          ) => {
            if (
              (values.min_price || values.max_price) &&
              e.target.value !== 'on'
            ) {
              setFieldValue('price', []);
            }

            if (e.target.value === 'on') {
              setFieldValue('min_price', '');
              setFieldValue('max_price', '');
            }

            if (e.target.name === 'min_price') {
              return setFieldValue('min_price', e.target.value);
            }
            if (e.target.name === 'max_price') {
              return setFieldValue('max_price', e.target.value);
            }

            handleFieldChange(e, module);
          };

          const handleMultiAreaFieldChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            module: string
          ) => {
            if (
              (values.min_area || values.max_area) &&
              e.target.value !== 'on'
            ) {
              setFieldValue('multiArea', []);
            }

            if (e.target.value === 'on') {
              setFieldValue('min_area', '');
              setFieldValue('max_area', '');
            }

            if (e.target.name === 'min_area') {
              return setFieldValue('min_area', e.target.value);
            }
            if (e.target.name === 'max_area') {
              return setFieldValue('max_area', e.target.value);
            }

            handleFieldChange(e, module);
          };

          const handleToggleButtonChange = (value: string, module: string) => {
            setFieldValue(module, value);
          };

          const handleChangePush = async (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            try {
              setFieldValue('push', e.target.checked);
              const res = await requestChangePush(condition._id as string);
              return showSnackBar(res as ConditionResponseProps);
            } catch (error) {
              console.log(error);
            }
          };

          return (
            <Form>
              <Grid container spacing={2}>
                {/* Control Panel */}
                <Grid item xs={6}>
                  <Switch
                    id='push'
                    name='push'
                    checked={values.push}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangePush(e)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant='contained'
                    color='info'
                    type='submit'
                    sx={{ float: 'right' }}>
                    儲存
                  </Button>
                </Grid>
                {/* Name 條件名稱 */}
                <NameSection
                  value={values.name as string}
                  onChange={handleChange}
                  index={conditionList.length}
                />
                {/* Region 地區 */}
                <RegionDropdown
                  value={values.region as string}
                  onChange={handleChange}
                  error={Boolean(errors.region)}
                  helpText={errors.region || ''}
                />
                {/* Section 位置 */}
                <SectionDropdown
                  region={values.region as string}
                  value={values.section as string[]}
                  onChange={handleChange}
                />
                {/* Kind 類型 */}
                <KindDropdown
                  module='kind'
                  value={values.kind as string}
                  onChange={handleToggleButtonChange}
                />
                {/* Price 租金 */}
                <PriceDropdown
                  module='price'
                  value={values.price as string[]}
                  onChange={handlePriceFieldChange}
                  min_price={values.min_price as string}
                  max_price={values.max_price as string}
                  error={Boolean(errors.min_price || errors.max_price)}
                  helpText={errors.min_price || errors.max_price || ''}
                />
                {/* MultiRoom 格局 */}
                <MultiRoomDropdown
                  module='multiRoom'
                  value={values.multiRoom as string[]}
                  onChange={handleFieldChange}
                />
                {/* Other 特色 */}
                <OtherDropdown
                  module='other'
                  value={values.other as string[]}
                  onChange={handleFieldChange}
                />
                {/* Shape 型態 */}
                <ShapeDropdown
                  module='shape'
                  value={values.shape as string[]}
                  onChange={handleFieldChange}
                />
                {/* MultiArea 坪數 */}
                <MultiAreaSection
                  module='multiArea'
                  value={values.multiArea as string[]}
                  onChange={handleMultiAreaFieldChange}
                  min_area={values.min_area as string}
                  max_area={values.max_area as string}
                  error={Boolean(errors.min_area || errors.max_area)}
                  helpText={errors.min_area || errors.max_area || ''}
                />
                {/* Floor 樓層 */}
                <FloorSection
                  module='floor'
                  value={values.floor as string}
                  onChange={handleToggleButtonChange}
                />
                {/* Option 設備 */}
                <OptionSection
                  module='option'
                  value={values.option as string[]}
                  onChange={handleFieldChange}
                />
                {/* MultiNotice 須知 */}
                <MultiNoticeSection
                  module='multiNotice'
                  value={values.multiNotice as string[]}
                  onChange={handleFieldChange}
                />
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ConditionCreatePage;

export interface ConditionExtraProps extends ConditionFormProps {
  max_price: string;
  min_price: string;
  max_area: string;
  min_area: string;
}

interface ConditionFormProps {
  name: string; // condition name
  push: boolean; // 是否推播
  current_id: string; // Current id
  floor: string; // 樓層
  shape: string[]; // 型態
  kind: string; // 類型
  multiArea: string[]; // 坪數
  multiNotice: string[]; // 須知
  multiRoom: string[]; // 格局
  option: string[]; // 設備
  other: string[]; // 特色
  region: string; // 地區
  section: string[]; // 位置
  price: string[]; // 租金
}
