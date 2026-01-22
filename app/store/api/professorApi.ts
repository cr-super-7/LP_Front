import api from "../utils/api";
import type { Professor, ProfessorsResponse } from "../interface/professorInterface";

interface GetProfessorsParams {
  specialization?: string;
  isAvailable?: boolean;
}

const getProfessors = async (params: GetProfessorsParams = {}): Promise<Professor[]> => {
  const queryParams: Record<string, string> = {};
  if (params.specialization) queryParams.specialization = params.specialization;
  if (typeof params.isAvailable === "boolean") {
    queryParams.isAvailable = params.isAvailable ? "true" : "false";
  }

  const { data } = await api.get<ProfessorsResponse>("/professors", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });

  return (
    data.professors ||
    (data as unknown as { result?: { professors?: Professor[] } }).result?.professors ||
    []
  );
};

export { getProfessors };
