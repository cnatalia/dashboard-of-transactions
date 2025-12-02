import { matchesDateFilter, customGlobalFilterFn, formatToday, formatWeekRange, formatMonthYear } from '../filters';
import { DATE_FILTER_MAP } from '@/constants';
import { DateFilterType } from '@/providers/filters-context';

describe('matchesDateFilter', () => {
  const mockNow = new Date('2024-12-15T12:00:00Z'); // Domingo 15 de diciembre de 2024

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('DATE_FILTER_MAP.TODAY - Success scenarios', () => {
    it('should return true for transaction created today at midnight', () => {
      const todayTimestamp = new Date('2024-12-15T10:00:00Z').getTime();
      expect(matchesDateFilter(todayTimestamp, DATE_FILTER_MAP.TODAY)).toBe(true);
    });

    it('should return true for transaction created today at end of day', () => {
      const todayTimestamp = new Date('2024-12-15T23:59:59Z').getTime();
      expect(matchesDateFilter(todayTimestamp, DATE_FILTER_MAP.TODAY)).toBe(true);
    });
  });

  describe('DATE_FILTER_MAP.TODAY - Failure scenarios', () => {
    it('should return false for transaction created yesterday', () => {
      const yesterdayTimestamp = new Date('2024-12-14T23:59:59Z').getTime();
      expect(matchesDateFilter(yesterdayTimestamp, DATE_FILTER_MAP.TODAY)).toBe(false);
    });
  });

  describe('DATE_FILTER_MAP.THIS_WEEK - Success scenarios', () => {
    it('should return true for transaction created on Monday of current week', () => {
      const mondayTimestamp = new Date('2024-12-09T10:00:00Z').getTime();
      expect(matchesDateFilter(mondayTimestamp, DATE_FILTER_MAP.THIS_WEEK)).toBe(true);
    });

  });

  describe('DATE_FILTER_MAP.THIS_WEEK - Failure scenarios', () => {
    it('should return false for transaction created last week', () => {
      const lastWeekTimestamp = new Date('2024-12-08T10:00:00Z').getTime();
      expect(matchesDateFilter(lastWeekTimestamp, DATE_FILTER_MAP.THIS_WEEK)).toBe(false);
    });
  });

  describe('DATE_FILTER_MAP.THIS_MONTH - Success scenarios', () => {
    it('should return true for transaction created on first day of month', () => {
      // Usar un horario que funcione con startOfDay local (no medianoche UTC)
      const firstDayTimestamp = new Date('2024-12-01T12:00:00Z').getTime();
      expect(matchesDateFilter(firstDayTimestamp, DATE_FILTER_MAP.THIS_MONTH)).toBe(true);
    });

    it('should return true for transaction created on last day of month', () => {
      const lastDayTimestamp = new Date('2024-12-31T23:59:59Z').getTime();
      expect(matchesDateFilter(lastDayTimestamp, DATE_FILTER_MAP.THIS_MONTH)).toBe(true);
    });
  });

  describe('DATE_FILTER_MAP.THIS_MONTH - Failure scenarios', () => {
    it('should return false for transaction created last month', () => {
      const lastMonthTimestamp = new Date('2024-11-30T23:59:59Z').getTime();
      expect(matchesDateFilter(lastMonthTimestamp, DATE_FILTER_MAP.THIS_MONTH)).toBe(false);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should return true when filterValue is null', () => {
      const timestamp = new Date('2024-12-15T10:00:00Z').getTime();
      expect(matchesDateFilter(timestamp, null)).toBe(true);
    });

    it('should return false when createdAt is 0', () => {
      expect(matchesDateFilter(0, DATE_FILTER_MAP.TODAY)).toBe(false);
    });

    it('should return false when createdAt is NaN', () => {
      expect(matchesDateFilter(NaN as any, DATE_FILTER_MAP.TODAY)).toBe(false);
    });
  });
});

describe('customGlobalFilterFn', () => {
  const mockNow = new Date('2024-12-15T12:00:00Z'); // Domingo 15 de diciembre de 2024

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const createMockRow = (data: any) => ({
    original: data,
    id: '1',
    index: 0,
    depth: 0,
  });

  describe('Date filter only - Success scenarios', () => {
    it('should filter by date when only dateFilter is provided (today)', () => {
      const todayTimestamp = new Date('2024-12-15T10:00:00Z').getTime();
      const row = createMockRow({
        createdAt: todayTimestamp,
        status: 'Cobro exitoso',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: '', dateFilter: DATE_FILTER_MAP.TODAY },
        {} as any
      );
      expect(result).toBe(true);
    });
  });

  describe('Date filter only - Failure scenarios', () => {
    it('should exclude rows that do not match date filter', () => {
      const yesterdayTimestamp = new Date('2024-12-14T10:00:00Z').getTime();
      const row = createMockRow({
        createdAt: yesterdayTimestamp,
        status: 'Cobro exitoso',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: '', dateFilter: DATE_FILTER_MAP.TODAY },
        {} as any
      );
      expect(result).toBe(false);
    });
  });

  describe('Text search only - Success scenarios', () => {
    it('should filter by text when only globalFilter is provided', () => {
      const row = createMockRow({
        createdAt: new Date('2024-12-15T10:00:00Z').getTime(),
        status: 'Cobro exitoso',
        paymentMethod: 'Tarjeta de crédito',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: 'exitoso', dateFilter: null },
        {} as any
      );
      expect(result).toBe(true);
    });

    it('should be case insensitive', () => {
      const row = createMockRow({
        createdAt: new Date('2024-12-15T10:00:00Z').getTime(),
        status: 'Cobro exitoso',
        paymentMethod: 'Tarjeta de crédito',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: 'EXITOSO', dateFilter: null },
        {} as any
      );
      expect(result).toBe(true);
    });

    it('should search across all fields', () => {
      const row = createMockRow({
        createdAt: new Date('2024-12-15T10:00:00Z').getTime(),
        status: 'Cobro exitoso',
        paymentMethod: 'Tarjeta de crédito',
        salesType: 'PAYMENT_LINK',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: 'PAYMENT_LINK', dateFilter: null },
        {} as any
      );
      expect(result).toBe(true);
    });
  });

  describe('Text search only - Failure scenarios', () => {
    it('should return false when text does not match', () => {
      const row = createMockRow({
        createdAt: new Date('2024-12-15T10:00:00Z').getTime(),
        status: 'Cobro exitoso',
        paymentMethod: 'Tarjeta de crédito',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: 'noexiste', dateFilter: null },
        {} as any
      );
      expect(result).toBe(false);
    });
  });

  describe('Combined filters (AND logic) - Success scenarios', () => {
    it('should return true when both filters match', () => {
      const todayTimestamp = new Date('2024-12-15T10:00:00Z').getTime();
      const row = createMockRow({
        createdAt: todayTimestamp,
        status: 'Cobro exitoso',
        paymentMethod: 'Tarjeta de crédito',
        amount: 1000,
      });

      const result = customGlobalFilterFn(
        row as any,
        '',
        { globalFilter: 'exitoso', dateFilter: DATE_FILTER_MAP.TODAY },
        {} as any
      );
      expect(result).toBe(true);
    });
  });
});

describe('Date formatting functions', () => {
  const mockNow = new Date('2024-12-15T12:00:00Z'); // Domingo 15 de diciembre de 2024

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('formatToday - Success scenarios', () => {
    it('should format today date in Spanish', () => {
      const result = formatToday();
      expect(result).toMatch(/15 de diciembre de 2024/);
    });

    it('should include day, month and year', () => {
      const result = formatToday();
      expect(result).toContain('15');
      expect(result).toContain('diciembre');
      expect(result).toContain('2024');
    });
  });

  describe('formatWeekRange - Success scenarios', () => {
    it('should format week range from Monday to today', () => {
      const result = formatWeekRange();
      expect(result).toMatch(/9 a 15 de diciembre de 2024/);
    });

    it('should return only today if today is Monday', () => {
      jest.setSystemTime(new Date('2024-12-09T12:00:00Z'));
      const result = formatWeekRange();
      expect(result).toMatch(/9 de diciembre de 2024/);
      expect(result).not.toContain('a');
      jest.setSystemTime(mockNow);
    });
  });

  describe('formatWeekRange - Edge cases', () => {
    it('should always return a string', () => {
      const result = formatWeekRange();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatMonthYear - Success scenarios', () => {
    it('should format current month and year in Spanish', () => {
      const result = formatMonthYear();
      expect(result).toBe('Diciembre, 2024');
    });

    it('should capitalize first letter of month', () => {
      const result = formatMonthYear();
      expect(result.charAt(0)).toBe('D');
    });
  });
});
