export const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatPhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    const match = phoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
        phoneNumber = `(${match[1]}${match[2] ? ') ' : ''}${match[2]}${match[3] ? '-' : ''}${match[3]}`;
    }
    return phoneNumber;
};

export const formatDate = (dateString) => {
    let date = new Date(dateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleString('en-US', options);
}

// number = number of weeks
export const formatTimeFrame = (number) => {
    let verbiage = '';
    switch (number) {
        case -1:
            verbiage = 'Immediately';
            break;
        case 1:
            verbiage = '1 Week';
            break;
        case 4:
            verbiage = '1 Month';
            break;
        default:
            verbiage = (number / 4) + ' Months';
            break;
    }
    return verbiage;
}