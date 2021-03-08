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
import Hours from "./index";

export default {
	title: "React Hours",
};

export const Default = () => <Hours theme="standard" />;
export const CustomLocale = () => <Hours locale="de" />;
export const Bootstrap = () => <Hours theme="bootstrap" />;
export const Predefined = () => <Hours value="We 12:00-14:00" />;
export const PredefinedAlwaysOpen = () => <Hours value="24/7" />;
export const PredefinedComplex = () => (
	<Hours value="Mo 01:00-04:15,08:00-10:00,16:30-18:15; Tu 17:30-18:30; We 04:15-24:00; Th 00:00-11:00; Fr 02:15-02:30,06:15-09:45; Sa 01:30-01:45,05:30-10:15; Su 17:45-19:00" />
);
export const ChangeCallback = () => (
	<Hours
		onChange={(val: string) => {
			console.log(val);
		}}
	/>
);
export const PredefinedAndChangeCallback = () => (
	<Hours
		onChange={(val: string) => {
			console.log(val);
		}}
		value="Mo 01:00-04:15,08:00-10:00,16:30-18:15; Tu 17:30-18:30; We 04:15-24:00; Th 00:00-11:00; Fr 02:15-02:30,06:15-09:45; Sa 01:30-01:45,05:30-10:15; Su 17:45-19:00"
	/>
);
