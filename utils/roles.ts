
export enum USER_ROLES {
    PATIENT = "role_paciente",
    NURSE = "role_enfermeiro",
    DOCTOR = "role_medico",
    ADMIN = "role_admin",
  }
  
  
  export const getRoleName = (roleId: string | undefined): string => {
    switch (roleId) {
      case USER_ROLES.PATIENT:
        return "Paciente";
      case USER_ROLES.NURSE:
        return "Enfermeiro";
      case USER_ROLES.DOCTOR:
        return "Médico";
      case USER_ROLES.ADMIN:
        return "Admin";
      default:
        return "Desconhecido";
    }
  };
  