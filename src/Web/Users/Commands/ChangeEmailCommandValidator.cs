using FluentValidation;
using Marten;
using System.Linq;

namespace Web.Users.Commands
{
    public class ChangeEmailCommandValidator : AbstractValidator<ChangeEmailCommand>
    {
        public ChangeEmailCommandValidator()
        {
            RuleFor(v => v.NewEmail)
                .MinimumLength(6)
                .MaximumLength(200)
                .NotEmpty()
                .WithMessage("Password must be between 6 and 200 characters long");
        }
    }
}