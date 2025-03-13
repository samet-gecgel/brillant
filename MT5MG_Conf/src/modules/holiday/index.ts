import { IHoliday } from "./types";

export default class Holiday implements IHoliday{
    Day: number;
    Description: string;
    Mode: string;
    Month: number;
    WorkFrom: number;
    WorkFromHours: number;
    WorkFromMinutes: number;
    WorkTo: number;
    WorkToHours: number;
    WorkToMinutes: number;
    Year: number;
    Symbols: string[];

    constructor(holiday : IHoliday) {

        this.Day = holiday.Day;
        this.Description = holiday.Description;
        this.Mode = holiday.Mode;
        this.Month = holiday.Month;
        this.WorkFrom = holiday.WorkFrom;
        this.WorkFromHours = holiday.WorkFromHours;
        this.WorkFromMinutes = holiday.WorkFromMinutes;
        this.WorkTo = holiday.WorkTo;
        this.WorkToHours = holiday.WorkFromHours;
        this.WorkToMinutes = holiday.WorkToMinutes;
        this.Year = holiday.Year;
        this.Symbols = holiday.Symbols;
        
    }

    setHoliday(holiday : IHoliday){
        this.Day = holiday.Day;
        this.Description = holiday.Description;
        this.Mode = holiday.Mode;
        this.Month = holiday.Month;
        this.WorkFrom = holiday.WorkFrom;
        this.WorkFromHours = holiday.WorkFromHours;
        this.WorkFromMinutes = holiday.WorkFromMinutes;
        this.WorkTo = holiday.WorkTo;
        this.WorkToHours = holiday.WorkFromHours;
        this.WorkToMinutes = holiday.WorkToMinutes;
        this.Year = holiday.Year;
        this.Symbols = holiday.Symbols;
    }

    toJSON(){
        return {
            Day: this.Day,
            Description: this.Description,
            Mode: this.Mode,
            Month: this.Month,
            WorkFrom: this.WorkFrom,
            WorkFromHours: this.WorkFromHours,
            WorkFromMinutes: this.WorkFromMinutes,
            WorkTo: this.WorkTo,
            WorkToHours: this.WorkToHours,
            WorkToMinutes: this.WorkToMinutes,
            Year: this.Year,
            Symbols: this.Symbols
        }
    }
}