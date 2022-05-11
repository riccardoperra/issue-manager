import { TUI_DATE_VALUE_TRANSFORMER } from '@taiga-ui/kit';
import { Directive } from '@angular/core';
import { TuiControlValueTransformer, TuiDay } from '@taiga-ui/cdk';

type From = TuiDay | null;
type To = string | Date | null;

class NativeDateTransformer implements TuiControlValueTransformer<From, To> {
  fromControlValue(controlValue: To): From {
    const date =
      typeof controlValue === 'string' ? new Date(controlValue) : controlValue;

    if (!date) return null;
    return TuiDay.fromLocalNativeDate(date);
  }

  toControlValue(componentValue: From): To {
    return componentValue && componentValue.toLocalNativeDate();
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'tui-input-date[toNativeDate]',
  providers: [
    {
      provide: TUI_DATE_VALUE_TRANSFORMER,
      useClass: NativeDateTransformer,
    },
  ],
  standalone: true,
})
export class ToNativeDateDirective {}
