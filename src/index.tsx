/**
 * react-hours
 * Copyright 2021 Marvin Schopf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @license Apache-2.0
 * @copyright 2021 Marvin Schopf
 *
 */

import React from "react";
import FullCalendar, {
	DateSelectArg,
	EventApi,
	EventClickArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import openingHours from "opening_hours";

moment.locale("en");

type Props = {
	value?: string;
	locale?: string;
	theme?: "standard" | "bootstrap";
	onChange?: (value: string) => void;
};

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

class Hours extends React.Component<Props> {
	calendarRef: React.RefObject<FullCalendar> = React.createRef();

	constructor(props: Props) {
		super(props);
	}

	private importOSM(oh: string) {
		if (oh != "24/7") {
			const ohObject = new openingHours(oh);
			const ohIterator = ohObject.getIterator(
				moment()
					.day("Monday")
					.set("hours", 0)
					.set("minutes", 0)
					.toDate()
			);
			let iteratorChanges = [];
			let latestChange;
			while (
				ohIterator.advance(
					moment()
						.day("Monday")
						.add(1, "week")
						.set("hours", 23)
						.set("minutes", 59)
						.toDate()
				)
			) {
				if (latestChange) {
					if (
						ohIterator.getState() === false &&
						latestChange.state === true
					) {
						latestChange.to = ohIterator.getDate();
						iteratorChanges.push(latestChange);
						this.calendarRef.current.getApi().addEvent({
							start: latestChange.from,
							end: latestChange.to,
						});
						latestChange = null;
					}
				} else {
					latestChange = {
						state: ohIterator.getState(),
						from: ohIterator.getDate(),
					};
				}
			}
		} else {
			[
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			].map((dayOfWeek: string) => {
				this.calendarRef.current.getApi().addEvent({
					start: moment()
						.day(dayOfWeek)
						.set("hours", 0)
						.set("minutes", 0)
						.toDate(),
					end: moment()
						.day(dayOfWeek)
						.set("hours", 23)
						.set("minutes", 59)
						.toDate(),
				});
			});
		}
		this.callChangeCallback();
	}

	private callChangeCallback() {
		if (this.props.onChange) {
			this.props.onChange(this.outputOSM());
		}
	}

	componentDidMount() {
		if (this.props.value) {
			this.importOSM(this.props.value);
		}
	}

	public getOSMString(): string {
		return this.outputOSM();
	}

	private outputOSM(): string {
		const events: EventApi[] = this.calendarRef.current
			.getApi()
			.getEvents();
		let timeFrames = {
			monday: [],
			tuesday: [],
			wednesday: [],
			thursday: [],
			friday: [],
			saturday: [],
			sunday: [],
		};
		let stringPieces: string[] = [];
		events.forEach((event: EventApi) => {
			if (event.start.getDay() === event.end.getDay()) {
				if (
					!timeFrames[
						moment(event.start).format("dddd").toLowerCase()
					].includes(
						`${moment(event.start).format("hh:mm")}-${moment(
							event.end
						).format("hh:mm")}`
					)
				) {
					timeFrames[
						moment(event.start).format("dddd").toLowerCase()
					].push(
						`${moment(event.start).format("hh:mm")}-${moment(
							event.end
						).format("hh:mm")}`
					);
				}
			} else {
				const momentBegin: moment.Moment = moment(event.start);
				const momentEnd: moment.Moment = moment(event.end);
				if (
					!timeFrames[
						momentBegin.format("dddd").toLowerCase()
					].includes(`${momentBegin.format("hh:mm")}-24:00`)
				) {
					timeFrames[momentBegin.format("dddd").toLowerCase()].push(
						`${momentBegin.format("hh:mm")}-24:00`
					);
				}
				if (
					!timeFrames[
						momentEnd.format("dddd").toLowerCase()
					].includes(`00:00-${momentEnd.format("hh:mm")}`)
				) {
					timeFrames[momentEnd.format("dddd").toLowerCase()].push(
						`00:00-${momentEnd.format("hh:mm")}`
					);
				}
				const numOfInDays: number =
					momentEnd
						.endOf("day")
						.diff(momentBegin.startOf("day"), "days") - 1;
				for (let i: number = 0; i < numOfInDays; i++) {
					if (
						!timeFrames[
							momentBegin
								.add(i, "days")
								.format("dddd")
								.toLowerCase()
						].includes("00:00-24:00")
					) {
						timeFrames[
							momentBegin
								.add(i, "days")
								.format("dddd")
								.toLowerCase()
						].push();
					}
				}
			}
		});
		[
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday",
		].map((dayOfWeek: string) => {
			if (timeFrames[dayOfWeek] && timeFrames[dayOfWeek].length >= 1) {
				stringPieces.push(
					`${capitalizeFirstLetter(
						dayOfWeek.substring(0, 2)
					)} ${timeFrames[dayOfWeek].join(",")}`
				);
			}
		});
		return stringPieces.join("; ");
	}

	render() {
		return (
			<React.Fragment>
				<FullCalendar
					ref={this.calendarRef}
					plugins={[interactionPlugin, dayGridPlugin]}
					selectable={true}
					selectOverlap={true}
					select={(selectionInfo: DateSelectArg) => {
						const existingEvents: EventApi[] = this.calendarRef.current
							.getApi()
							.getEvents();
						let conflict: boolean = false;
						existingEvents.forEach((existingEvent: EventApi) => {
							if (
								moment(selectionInfo.start).isBetween(
									existingEvent.start,
									existingEvent.end
								) ||
								moment(selectionInfo.end).isBetween(
									existingEvent.start,
									existingEvent.end
								) ||
								moment(existingEvent.start).isBetween(
									selectionInfo.start,
									selectionInfo.end
								) ||
								moment(existingEvent.end).isBetween(
									selectionInfo.start,
									selectionInfo.end
								)
							) {
								conflict = true;
							}
						});
						if (!conflict) {
							this.calendarRef.current.getApi().addEvent({
								start: selectionInfo.start,
								end: selectionInfo.end,
							});
							this.callChangeCallback();
						}
					}}
					locale={this.props.locale ? this.props.locale : "en"}
					headerToolbar={false}
					dayHeaderFormat={{
						weekday: "long",
					}}
					themeSystem={
						this.props.theme ? this.props.theme : "standard"
					}
					eventClick={(eventInfo: EventClickArg) => {
						eventInfo.event.remove();
						this.callChangeCallback();
					}}
					eventOverlap={false}
					editable={true}
					droppable={false}
					eventTimeFormat={{
						hour12: false,
						hour: "2-digit",
						minute: "2-digit",
					}}
				/>
			</React.Fragment>
		);
	}
}

export default Hours;
