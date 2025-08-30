export const formatCurrency = (pennies: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(pennies / 100);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(parseInt(dateString));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isAdmin = (adminList: string, userId: string | undefined): boolean => {
  if (!userId) return false;
  return adminList.split(",").includes(userId);
};
