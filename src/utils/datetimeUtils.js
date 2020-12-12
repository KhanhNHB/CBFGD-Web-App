import moment from 'moment';

const UNIT_OF_TIME_IS_DATE = 'date';
const UNIT_OF_TIME_IS_MONTH = 'month';
const FORMAT_ORIGIN_DATE_TIME = '';
const FORMAT_DATE_TIME = 'DD/MM/YYYY h:mm:ss A';
const FORMAT_DATE = 'DD/MM/YYYY';
const LOCALE = "vi-VN";
const TIME_ZONE = "Asia/Ho_Chi_Minh";

export default {
    GetStartOrEndOfCurrentDate: (isStartDateTime, isStartMonth) => {
        let originalCurrentDateTimeStart = '';
        let currentUnitOfTime = UNIT_OF_TIME_IS_DATE;
        if (isStartMonth) {
            currentUnitOfTime = UNIT_OF_TIME_IS_MONTH;
        }
        if (isStartDateTime) {
            originalCurrentDateTimeStart = moment().startOf(currentUnitOfTime).format(FORMAT_ORIGIN_DATE_TIME);
        } else {
            originalCurrentDateTimeStart = moment().endOf(currentUnitOfTime).format(FORMAT_ORIGIN_DATE_TIME);
        }
        const milliseconds = Date.parse(originalCurrentDateTimeStart);
        return new Date(milliseconds);
    },
    GetCurrentMilliSeconds: () => {
        const currentDateTime = moment().format(FORMAT_ORIGIN_DATE_TIME);
        return Date.parse(currentDateTime);
    },
    GetCurrentDateTime: () => {
        const currentDateTime = new Date().toLocaleString(LOCALE, { timeZone: TIME_ZONE });
        const milliseconds = Date.parse(currentDateTime);
        return new Date(milliseconds);
    },
    GetCurrentDateTimeForFile: () => {
        const currentDateTime = moment().format(FORMAT_ORIGIN_DATE_TIME);
        const milliseconds = Date.parse(currentDateTime);
        return moment(new Date(milliseconds)).format(FORMAT_DATE_TIME);
    },
    DisplayDateTimeFormat: (dateTime) => {
        // return moment(new Date(dateTime)).format(FORMAT_DATE_TIME);
        return moment(dateTime).format(FORMAT_DATE_TIME);
    },
    DisplayDateFormat: (date) => {
        return moment(date).format(FORMAT_DATE);
    },
    DisplayDateTimeFromNow: (dateTime) => {
        return moment(new Date(dateTime)).startOf('').fromNow();
    },
    DisplayDatePicker: (datetime) => {
        const date = new Date(datetime);

        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    },
};