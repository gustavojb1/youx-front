
export const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };
  