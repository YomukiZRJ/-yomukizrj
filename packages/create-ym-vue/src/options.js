

export const vue3Dependencies = [
	{
		title: "vueuse",
		value: {
			dependencies: {
				"@vueuse/core": "^8.4.2",
			},
		},
	},
	{
		title: "axios",
		value: {
			dependencies: {
				axios: "^0.26.0",
			},
            configurationFile:{
                from:"axios",
                to:"src/libs"
            }
		},
	},
	{
		title: "lodash",
		value: {
			dependencies: {
				"lodash-es": "^4.17.21",
			},
		},
	},
	{
		title: "pinia",
		value: {
			dependencies: {
				pinia: "^2.0.11",
			},
            configurationFile:{
                from:"pinia",
                to:"src"
            }
		},
	},
	{
		title: "vue-router",
		value: {
			dependencies: {
				"vue-router": "^4.0.12",
			},
            configurationFile:{
                from:"router",
                to:"src"
            }
		},
	},
];
