
export enum STATUS_ID {
    SUCCESSFUL = 'SUCCESSFUL',
    FAILED = 'REJECTED',
  }

export const STATUS_MAP = {
    [STATUS_ID.SUCCESSFUL]:  {
      label: 'Cobro exitoso',
      color: 'green',
      icon: 'e890',
    },
    [STATUS_ID.FAILED]: {
      label: 'Cobro no realizado',
      color: 'red',
      icon: 'e891',
    },
  };

export enum DATE_FILTER_MAP {
  TODAY = 'today',
  THIS_WEEK = 'thisWeek',
  THIS_MONTH = 'thisMonth',
}

export const DATE_FILTER_MAP_LABEL = {
  [DATE_FILTER_MAP.TODAY]: 'hoy',
  [DATE_FILTER_MAP.THIS_WEEK]: 'esta semana',
  [DATE_FILTER_MAP.THIS_MONTH]: 'este mes',
};


export enum SALES_TYPE_FILTER {
  PAYMENT_LINK = 'PAYMENT_LINK',
  TERMINAL = 'TERMINAL',
  ALL = 'all',
}

export const SALES_TYPE_FILTER_MAP_LABEL = {
  [SALES_TYPE_FILTER.PAYMENT_LINK]: {'filterLabel': 'Cobro con link de pago', 'modalLabel': 'Link de pagos'},
  [SALES_TYPE_FILTER.TERMINAL]: {'filterLabel': 'Cobro con datáfono', 'modalLabel': 'Datáfono'},
  [SALES_TYPE_FILTER.ALL]: {'filterLabel': 'Ver todos', 'modalLabel': 'Todos'},
};

export interface TransactionDetail {
    id: string;
    status: string;
    paymentMethod: string;
    salesType: string;
    createdAt: number;
    amount: number;
    deduction?: number;
    createdAtFormatted: string;
    amountFormatted: string;
    deductionFormatted: string;
  }