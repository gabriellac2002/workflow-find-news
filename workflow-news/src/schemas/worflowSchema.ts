import z from "zod";

export const inputWorkflowSchema = z.object({
  theme: z.string().min(3).max(50),
  focusArea: z.enum([
    "hooks",
    "state-management",
    "performance",
    "testing",
    "deployment",
    "accessibility",
    "security",
    "ui/ux",
  ]),
});

export const outputSchema = z.object({
  links: z.array(z.string().url()),
  summary: z.string(),
});
