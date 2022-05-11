import { TuiControlValueTransformer, TuiDay } from '@taiga-ui/cdk';
import { TUI_DATE_VALUE_TRANSFORMER } from '@taiga-ui/kit';

type From = TuiDay | null;

type To = Date | null;

// class LocalNativeDateTransformer
//   implements TuiControlValueTransformer<From, To>
// {
//   fromControlValue(controlValue: To): From {
//     return controlValue && TuiDay.fromLocalNativeDate(controlValue);
//   }
//
//   toControlValue(componentValue: From): To {
//     return componentValue && componentValue.toLocalNativeDate();
//   }
// }
//
// export const LOCAL_DATE_TRANSFORMER_PROVIDER = {
//   provide: TUI_DATE_VALUE_TRANSFORMER,
//   useClass: LocalNativeDateTransformer,
// };
