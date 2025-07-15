export const useCustomerTrigger = (callback) => {
  const trigger = () => {
    setTimeout(() => {
      callback();
    });
  };

  return trigger;
};
