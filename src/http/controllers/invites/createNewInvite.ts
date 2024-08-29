import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createNewInvite(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { org } = request.user;
  if (!org)
    return reply.status(401).send({
      error: "organization not assigned",
      message: "should be associated with an organization to send invites",
    });

  const newInviteBodySchema = z.object({
    invitedPhone: z.string(),
    invitedEmail: z.string().optional(),
    dueDate: z.coerce.date().optional(),
  });

  const { invitedPhone, invitedEmail, dueDate } = newInviteBodySchema.parse(
    request.body,
  );
}
