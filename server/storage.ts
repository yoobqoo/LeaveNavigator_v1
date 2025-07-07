import { LeaveCalculation, Holiday, LeaveSettings, InsertLeaveCalculation, InsertHoliday, InsertLeaveSettings } from '../shared/schema';

export interface IStorage {
  // 육아휴직 계산 관련
  createLeaveCalculation(calculation: InsertLeaveCalculation): Promise<LeaveCalculation>;
  getLeaveCalculation(id: string): Promise<LeaveCalculation | null>;
  getAllLeaveCalculations(): Promise<LeaveCalculation[]>;
  updateLeaveCalculation(id: string, calculation: Partial<InsertLeaveCalculation>): Promise<LeaveCalculation>;
  deleteLeaveCalculation(id: string): Promise<void>;

  // 공휴일 관리
  createHoliday(holiday: InsertHoliday): Promise<Holiday>;
  getHoliday(id: string): Promise<Holiday | null>;
  getAllHolidays(): Promise<Holiday[]>;
  getHolidaysByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]>;
  updateHoliday(id: string, holiday: Partial<InsertHoliday>): Promise<Holiday>;
  deleteHoliday(id: string): Promise<void>;

  // 설정 관리
  createLeaveSettings(settings: InsertLeaveSettings): Promise<LeaveSettings>;
  getLeaveSettings(id: string): Promise<LeaveSettings | null>;
  getDefaultLeaveSettings(): Promise<LeaveSettings>;
  updateLeaveSettings(id: string, settings: Partial<InsertLeaveSettings>): Promise<LeaveSettings>;
}

export class MemStorage implements IStorage {
  private leaveCalculations: Map<string, LeaveCalculation> = new Map();
  private holidays: Map<string, Holiday> = new Map();
  private leaveSettings: Map<string, LeaveSettings> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // 기본 설정 데이터 초기화
    const defaultSettings: LeaveSettings = {
      id: 'default',
      maternityLeaveDays: 90,
      paternalLeaveDays: 365,
      prenatalDays: 45,
      postnatalDays: 45,
      isCustomizable: true,
    };
    this.leaveSettings.set('default', defaultSettings);

    // 2024년 한국 공휴일 데이터 초기화
    const holidays2024: Holiday[] = [
      { id: '1', date: new Date('2024-01-01'), name: '신정', isNationalHoliday: true },
      { id: '2', date: new Date('2024-02-09'), name: '설날 연휴', isNationalHoliday: true },
      { id: '3', date: new Date('2024-02-10'), name: '설날', isNationalHoliday: true },
      { id: '4', date: new Date('2024-02-11'), name: '설날 연휴', isNationalHoliday: true },
      { id: '5', date: new Date('2024-02-12'), name: '대체공휴일', isNationalHoliday: true },
      { id: '6', date: new Date('2024-03-01'), name: '삼일절', isNationalHoliday: true },
      { id: '7', date: new Date('2024-04-10'), name: '국회의원선거일', isNationalHoliday: true },
      { id: '8', date: new Date('2024-05-05'), name: '어린이날', isNationalHoliday: true },
      { id: '9', date: new Date('2024-05-06'), name: '대체공휴일', isNationalHoliday: true },
      { id: '10', date: new Date('2024-05-15'), name: '부처님오신날', isNationalHoliday: true },
      { id: '11', date: new Date('2024-06-06'), name: '현충일', isNationalHoliday: true },
      { id: '12', date: new Date('2024-08-15'), name: '광복절', isNationalHoliday: true },
      { id: '13', date: new Date('2024-09-16'), name: '추석 연휴', isNationalHoliday: true },
      { id: '14', date: new Date('2024-09-17'), name: '추석', isNationalHoliday: true },
      { id: '15', date: new Date('2024-09-18'), name: '추석 연휴', isNationalHoliday: true },
      { id: '16', date: new Date('2024-10-03'), name: '개천절', isNationalHoliday: true },
      { id: '17', date: new Date('2024-10-09'), name: '한글날', isNationalHoliday: true },
      { id: '18', date: new Date('2024-12-25'), name: '크리스마스', isNationalHoliday: true },
    ];

    holidays2024.forEach(holiday => {
      this.holidays.set(holiday.id, holiday);
    });
  }

  // 육아휴직 계산 관련 메서드
  async createLeaveCalculation(calculation: InsertLeaveCalculation): Promise<LeaveCalculation> {
    const id = Math.random().toString(36).substr(2, 9);
    const newCalculation: LeaveCalculation = {
      ...calculation,
      id,
      createdAt: new Date(),
    };
    this.leaveCalculations.set(id, newCalculation);
    return newCalculation;
  }

  async getLeaveCalculation(id: string): Promise<LeaveCalculation | null> {
    return this.leaveCalculations.get(id) || null;
  }

  async getAllLeaveCalculations(): Promise<LeaveCalculation[]> {
    return Array.from(this.leaveCalculations.values());
  }

  async updateLeaveCalculation(id: string, calculation: Partial<InsertLeaveCalculation>): Promise<LeaveCalculation> {
    const existing = this.leaveCalculations.get(id);
    if (!existing) {
      throw new Error('계산 내역을 찾을 수 없습니다.');
    }
    const updated = { ...existing, ...calculation };
    this.leaveCalculations.set(id, updated);
    return updated;
  }

  async deleteLeaveCalculation(id: string): Promise<void> {
    this.leaveCalculations.delete(id);
  }

  // 공휴일 관련 메서드
  async createHoliday(holiday: InsertHoliday): Promise<Holiday> {
    const id = Math.random().toString(36).substr(2, 9);
    const newHoliday: Holiday = { ...holiday, id };
    this.holidays.set(id, newHoliday);
    return newHoliday;
  }

  async getHoliday(id: string): Promise<Holiday | null> {
    return this.holidays.get(id) || null;
  }

  async getAllHolidays(): Promise<Holiday[]> {
    return Array.from(this.holidays.values());
  }

  async getHolidaysByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
    return Array.from(this.holidays.values()).filter(holiday => 
      holiday.date >= startDate && holiday.date <= endDate
    );
  }

  async updateHoliday(id: string, holiday: Partial<InsertHoliday>): Promise<Holiday> {
    const existing = this.holidays.get(id);
    if (!existing) {
      throw new Error('공휴일을 찾을 수 없습니다.');
    }
    const updated = { ...existing, ...holiday };
    this.holidays.set(id, updated);
    return updated;
  }

  async deleteHoliday(id: string): Promise<void> {
    this.holidays.delete(id);
  }

  // 설정 관련 메서드
  async createLeaveSettings(settings: InsertLeaveSettings): Promise<LeaveSettings> {
    const id = Math.random().toString(36).substr(2, 9);
    const newSettings: LeaveSettings = { ...settings, id };
    this.leaveSettings.set(id, newSettings);
    return newSettings;
  }

  async getLeaveSettings(id: string): Promise<LeaveSettings | null> {
    return this.leaveSettings.get(id) || null;
  }

  async getDefaultLeaveSettings(): Promise<LeaveSettings> {
    return this.leaveSettings.get('default')!;
  }

  async updateLeaveSettings(id: string, settings: Partial<InsertLeaveSettings>): Promise<LeaveSettings> {
    const existing = this.leaveSettings.get(id);
    if (!existing) {
      throw new Error('설정을 찾을 수 없습니다.');
    }
    const updated = { ...existing, ...settings };
    this.leaveSettings.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();