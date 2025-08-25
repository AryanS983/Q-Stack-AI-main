export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getInitials = (title) =>{
    if(!title) return ""

    const words = title.split(" ")
    const initials = words.map(word => word.charAt(0).toUpperCase()).join("")

    return initials
}