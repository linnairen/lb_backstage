const types = {
	'车位抵押融资': {
        '等额本息': {
            odds: 1.50,
            periods: [12, 18, 24, 36]
        },
        '先息后本': {
            odds: 2.30,
            periods: [1, 3, 6]
        }
   	},
    '车位按揭融资': {
        '等额本息': {
            odds: 1.50,
            periods: [12, 24, 36],
        }
    }
};

export default types;