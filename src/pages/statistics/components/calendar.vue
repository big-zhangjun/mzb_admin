<template>
    <div class="statistics-box">
        <div class="calendar">
            <div class="calendar-header">
                <div class="header-icon-wrap" @click="handleClickPrevMonth">
                    <a-icon type="left" style="color: #fff;" />
                </div>
                <div class="calendar-date">{{ nowYear + "年" + nowMonth + "月" }}</div>
                <div class="header-icon-wrap" @click="handleClickNextMonth">
                    <a-icon type="right" style="color: #fff;" />
                </div>
                <!-- <div class="calendar-tip">22</div> -->
            </div>
            <!-- 星期展示 -->
            <div class="calendar-grid calendar-week">
                <div v-for="(value, index) in weekDay" :key="index" class="calendar-grid-item calendar-week-item">
                    <div class="calendar-grid-item-text"> {{ value }}</div>
                </div>
            </div>
            <!-- 日期内容 -->
            <div class="calendar-grid calendar-day">
                <div v-for="(item, index) in totalDayList" :key="index" class="calendar-grid-item calendar-day-item"
                    @click="handleCheck(item, index)">
                    <div :class="{
                        'calendar-grid-item-text': true,
                        'calendar-prev-month-day': item.prevMonth,
                        'calendar-next-month-day': item.nextMonth,
                        'calendar-check': item.check,
                        'calendar-today': item.today,
                    }">
                        {{ item.day }}
                    </div>
                    <div v-if="item.warnning" class="calendar-day-mark">
                        <div class="warnging-round"></div>
                    </div>
                    <div v-if="item.success" class="calendar-day-mark">
                        <div class="success-round"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="header">
                共 <span>{{ worlList.length }}</span> 条日志
            </div>
            <div class="list" v-if="worlList.length">
                <div class="card" v-for="item in worlList" :key="item.id">
                    <div class="avawer">
                        <a-avatar style="color: #f56a00;font-size: 12px; backgroundColor: #fde3cf" :size="40">
                           {{  item.realName  }}
                        </a-avatar>
                    </div>
                    <div class="detail">
                        <div class="name"><span>{{ item.realName }}</span><span class="modal">{{ item.model
                                }}</span><span class="date">{{ item.blogDate }}</span></div>
                        <div class="cus">{{ item.customerName }}</div>
                        <div class="value">{{ item.content }}</div>
                        <div class="address">{{ item.address }}</div>
                    </div>
                </div>
            </div>
            <div class="no-data" v-else>
                <a-empty />
                <!-- <u-empty mode="data">
                </u-empty> -->
            </div>
        </div>
    </div>
</template>

<script>
// import * as $http from '../../../request/index
import { getBlogList2 } from '@/services/electrical'
export default {
    props: {
        userID: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            values: [],
            dataSoruce: [],
            worlList: [],
            weekDay: ["日", "一", "二", "三", "四", "五", "六"],
            nowYear: new Date().getFullYear(),
            nowMonth: new Date().getMonth() + 1,
            nowDay: new Date().getDate(),
            maxDayList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            totalDay: [],
        };
    },
    computed: {
        totalDayList() {
            let arr = this.dataSoruce.map(item => item.blogDate)
            console.log(arr, 'dataSoruce');
            let list = this.totalDay.map((item, idx) => {
                let value = this.formatDate(item.year, item.month, item.day)
                return {
                    warnning: !arr.includes(value) && this.compareDate(value),
                    success: arr.includes(value),
                    ...item,
                }
            })
            return list
        }
    },
    methods: {
        initData() {
            this.getData()
            this.initCalendar();
        },
        compareDate(dateString) {
            // 将传入的日期字符串转换为Date对象  
            const inputDate = new Date(dateString);

            // 获取当前日期和时间  
            const today = new Date();

            // 为了仅比较日期部分，我们将时间设置为00:00:00  
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            // 比较两个日期  
            if (inputDate < today) {
                return true;
            } else if (inputDate > today) {
                return false;
            } else {
                return false;
            }
        }
        ,
        formatDate(year, month, day) {
            // 使用模板字符串确保月份和日期始终是两位数  
            // 如果月份或日期小于10，前面会添加一个0  
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        },
        async getData() {
            let params = {
                "userID": this.userID,
                "startDate": "",
                "endDate": ""
            }
            let res = await getBlogList2(params)
            this.dataSoruce = res.data.data
        },
        async getCurrentData(startDate, endDate) {
            let params = {
                "userID": this.userID,
                "startDate": startDate,
                "endDate": endDate
            }
            let res = await getBlogList2(params)
            this.worlList = res.data.data
        },
        initCalendar() {
            const maxDayList = [...this.maxDayList];
            const year = this.nowYear;
            const month = this.nowMonth;

            //计算当前年是不是闰年，规则：能被4整除且不被100整除，或者能被400整除的年份
            maxDayList[1] =
                (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;

            this.maxDayList = maxDayList;

            // 累计当天天数
            let days = [];
            for (let index = 1; index <= maxDayList[month - 1]; index++) {
                let { check, value } = this.getCheckState(year, month, index);
                days.push({
                    year,
                    month,
                    day: index,
                    today: this.isToDay(index),
                    check,
                    value,
                });
            }

            //当前月的1号是星期几,0是星期天
            let firstDayWeek = new Date(year + "/" + month + "/1").getDay();

            //需要补的前置天数，需要处理是否是本年的月份
            let beforeDays = [];
            let nowYear = this.nowYear;
            let previousMonth = month - 1;
            let previousMonthIndex = month - 2;
            if (previousMonthIndex < 0) {
                previousMonthIndex = 11;
                nowYear = nowYear - 1;
                previousMonth = 12;
            }
            for (let index = 0; index < firstDayWeek; index++) {
                let day = maxDayList[previousMonthIndex] - index;
                let { check, value } = this.getCheckState(
                    nowYear,
                    previousMonthIndex + 1,
                    day
                );
                beforeDays.push({
                    year,
                    month: previousMonth,
                    day,
                    prevMonth: true,
                    check,
                    value,
                });
            }
            //当前月最后一天是星期几
            let endDayWeek = new Date(
                year + "/" + month + "/" + maxDayList[month - 1]
            ).getDay();

            let newxMonth = month + 1;
            if (month === 12) {
                newxMonth = 1;
            }
            //需要补的后置天数
            let afterDays = [];
            for (let index = 1; index < 7 - endDayWeek; index++) {
                let { check, value } = this.getCheckState(nowYear, newxMonth, index);
                afterDays.push({
                    year,
                    month: newxMonth,
                    day: index,
                    nextMonth: true,
                    check,
                    value,
                });
            }

            this.totalDay = [...beforeDays.reverse(), ...days, ...afterDays];
            let startDate = this.formatDate(days[0].year, days[0].month, days[0].day)
            let endtDate = this.formatDate(days[days.length - 1].year, days[days.length - 1].month, days[days.length - 1].day)
            console.log(this.totalDay, 'totalDay');
            this.getCurrentData(startDate, endtDate)

        },

        getCheckState(year, month, day) {
            let currentMonth = month > 9 ? month : "0" + month;
            let currentDay = day > 9 ? day : "0" + day;
            let curentDate = `${year}${currentMonth}${currentDay}`;
            let item = this.values?.find((item) => item.date === curentDate);
            if (item) return { check: true, value: item.xbCount };
            return {};
        },

        isToDay(day) {
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth() + 1;
            let currentDay = new Date().getDate();
            if (
                currentDay === day &&
                this.nowYear === currentYear &&
                this.nowMonth === currentMonth
            )
                return true;
            return false;
        },

        handleClickPrevMonth() {
            if (this.nowMonth === 1) {
                this.nowMonth = 12;
                this.nowYear = this.nowYear - 1;
            } else {
                this.nowMonth = this.nowMonth - 1;
            }

            this.initCalendar();
        },

        handleClickNextMonth() {
            if (this.nowMonth === 12) {
                this.nowMonth = 1;
                this.nowYear = this.nowYear + 1;
            } else {
                this.nowMonth = this.nowMonth + 1;
            }

            this.initCalendar();
        },

        handleCheck(item, idx) {
            this.totalDay.forEach((item, index) => {
                if (idx === index) {
                    item.check = true
                } else {
                    item.check = false
                }

            })
            let date = this.formatDate(item.year, item.month, item.day)
            this.getCurrentData(date, date)
        }
    }
};
</script>

<style lang="less" scoped>
.statistics-box {
    flex: 1;
    display: flex;
    gap: 12px;
}

.calendar {
    flex: 1;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 8px;
    padding-bottom: 12px;

    .calendar-header {
        padding: 0 16px;
        margin: 0px 0 12px;
        height: 48px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .right-wrap {
            width: 140px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header-icon-wrap {
            background-color: rgb(81, 104, 255);
            width: 30px;
            height: 30px;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .calendar-date {
            font-size: 18px;
            font-weight: 500;
            color: #07132b;
            padding: 0 16px;
            font-weight: bold;
        }

        .calendar-tip {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            background: #fff5c6;
            border-radius: 26px 0px 0px 26px;
            padding: 0 16px 0 20px;
            line-height: 48px;
            font-size: 24px;
            font-weight: 400;
            color: #eccc66;
        }
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 14.28%);

        .calendar-week-item {
            .calendar-grid-item-text {
                font-size: 14px;
                color: #12151b;
            }
        }

        .calendar-day-item {
            .calendar-grid-item-text {
                font-size: 16px;
                color: #12151b;
                width: 62px;
                height: 62px;
                background-color: rgb(250, 250, 250);
                border-radius: 12px;
            }
        }

        .calendar-grid-item {
            // height: 44px;
            text-align: center;
            font-size: 16px;
            position: relative;
            font-weight: 500;
            color: #07132b;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: column;
            margin-top: 12px;

            .calendar-grid-item-text {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 62px;
                height: 62px;
                //   color: #12151b;
            }
        }
    }

    .calendar-day {
        .calendar-day-item {

            .calendar-prev-month-day,
            .calendar-next-month-day {
                color: #a6b1bf;
                background-color: #fff;
            }

            .calendar-check {
                background: rgba(81, 104, 255, .3);
                // border-radius: 50%;
                color: #12151b;
            }

            .calendar-warnning-day {
                color: red;
            }

            .calendar-today {
                background: rgba(81, 104, 255);
                color: #ffffff;
            }

            .calendar-day-mark {
                .warnging-round {
                    width: 6px;
                    height: 6px;
                    background-color: rgb(255, 113, 91);
                    border-radius: 50%;
                    position: absolute;
                    bottom: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .success-round {
                    width: 6px;
                    height: 6px;
                    background-color: rgb(64, 135, 241);
                    border-radius: 50%;
                    position: absolute;
                    bottom: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
}

.content {
    font-size: 32px;
    width: 430px;
    padding-bottom: 12px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #fff;
    min-height: 504px;

    .header {
        font-weight: bold;
        font-size: 16px;
        color: #12151b;
        margin: 12px;

        span {
            color: rgba(255, 39, 39, 0.904);
            font-weight: normal;
        }
    }

    .list {
        height: calc(504px - 50px);
        overflow-y: auto;

        .card {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 20px 20px;
            padding-bottom: 10px;
            border-bottom: 1px dashed #e7e7e7;

            &:last-child {
                padding-bottom: 50px;
                border: none;
            }

            .avawer {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;

                .user {
                    width: 100px;
                    height: 100px;
                }
            }

            .detail {
                font-size: 12px;
                padding-left: 10px;
                flex: 1;

                .name {
                    display: flex;
                    font-size: 12px;

                    .modal {
                        margin-left: 12px;
                        color: rgb(81, 104, 255);
                    }

                    .date {
                        margin-left: auto;
                    }
                }

                .cus {
                    margin-top: 6px;
                    margin-bottom: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #12151b;
                }

                .address {
                    color: #aaaaaa;
                }
                .value {
                    color: #862c02;
                    margin-bottom: 6px;
                }
            }

            .right {
                position: relative;
                display: none;

                .model {
                    color: rgb(255, 181, 43);
                    align-items: center;
                    border-radius: 4px;
                    font-size: 24px;
                }

                .date {
                    color: #aaaaaa;
                    font-size: 22px;
                    margin-top: 80px;
                }
            }
        }
    }

    .no-data {
        margin-top: 50px;
        padding-bottom: 50px;
    }
}
</style>