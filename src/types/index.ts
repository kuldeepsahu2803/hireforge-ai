import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Education = Tables<"education">;
export type Experience = Tables<"experience">;
export type Project = Tables<"projects">;
export type Skills = Tables<"skills">;
export type Certification = Tables<"certifications">;
export type Achievement = Tables<"achievements">;
export type Job = Tables<"jobs">;
export type UserJob = Tables<"user_jobs">;
export type Resume = Tables<"resumes">;
export type TailoredResume = Tables<"tailored_resumes">;
export type SearchSchedule = Tables<"search_schedules">;
export type SearchLog = Tables<"search_logs">;

export type JobStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export const JOB_STATUSES: JobStatus[] = ["saved", "applied", "interview", "offer", "rejected"];