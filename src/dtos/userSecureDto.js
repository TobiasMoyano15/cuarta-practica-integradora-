function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class UserSecureDto {
    constructor(user) {
        this.email = user.email
        this.age = user.age
        this.fullName = `${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(user.last_name)}`
    }
}

export default UserSecureDto