
export const usePhoneNumberHelpers = () => {
  const formatPhoneNumber = (phone: any, countryCode: any) => {
    return phone.replace(/^0+/, "").replace(/\D/g, "").padStart(11, countryCode);
  }


  return { formatPhoneNumber };
};
