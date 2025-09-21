const formatDepartment = (departmentId: string | undefined): string => {
  if (!departmentId) return 'Uncategorized';

  const departmentMap: Record<string, string> = {
    computer_science: 'Computer Science',
    information_systems: 'Information Systems',
    telecommunications: 'Telecommunications',
  };

  return (
    departmentMap[departmentId] ||
    departmentId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

export default formatDepartment;
