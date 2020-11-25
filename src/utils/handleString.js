export default {
    upperCaseFirstCharacter: (string) => {
        let value = string;
        if (!value.length) return;
        if (value.length === 1) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }

        value = value.replace("_", " ");
        value = value.split(" ");
        for (let i = 0, x = value.length; i < x; i++) {
            value[i] = value[i][0].toUpperCase() + value[i].substr(1);
        }

        return value.join(" ");
    }
}