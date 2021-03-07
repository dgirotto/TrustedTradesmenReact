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
            verbiage = 'Immediate';
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

export const formatBudget = (budgetId) => {
    let verbiage = '';
    switch (budgetId) {
        case 1:
            verbiage = 'Under $1,000';
            break;
        case 2:
            verbiage = '$1,000 - $2,000';
            break;
        case 3:
            verbiage = '$2,000 - $4,000';
            break;
        case 4:
            verbiage = '$4,000 - $10,000';
            break;
        case 5:
            verbiage = 'Over $10,000';
            break;
        default:
            break;
    }
    return verbiage;
}