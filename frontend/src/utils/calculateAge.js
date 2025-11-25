export function calculateAge(birthdate) {
    const dob = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    // Check if birthday has occurred yet this year
    const hasBirthdayPassed =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
            today.getDate() >= dob.getDate());

    if (!hasBirthdayPassed) {
        age--;
    }

    return age;
}
