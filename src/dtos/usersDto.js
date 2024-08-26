function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class UserDto {
    constructor(user) {
        this.first_name = capitalizeFirstLetter(user.first_name);
        this.last_name = capitalizeFirstLetter(user.last_name);
        this.email = user.email;
        this.age = user.age;
        this.password = user.password;
        this.cart = user.cart;
        this.fullName = `${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(user.last_name)}`;
    }
}

export default UserDto;
