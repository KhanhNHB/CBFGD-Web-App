export default {
    format: (price) => {
        let priceChain = price + '';

        let length = priceChain.length;

        let result = '';
        let count = 0;

        for (let i = length - 1; i >= 0; i--) {
            if (count === 3) {
                result = "." + result;
                count = 0;
            }
            result = priceChain[i] + result;

            count++;
        }

        return result;
    }
}