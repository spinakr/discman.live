using FluentValidation;
using Marten;
using System;
using System.Linq;
using System.Net.Mail;

namespace Web.Users.Commands
{
    public class CreateNewUserCommandValidator : AbstractValidator<CreateNewUserCommand>
    {
        private readonly IDocumentSession _documentSession;

        public CreateNewUserCommandValidator(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            RuleFor(v => v.Password)
                .MinimumLength(6)
                .MaximumLength(200)
                .NotEmpty()
                .WithMessage("Password must be between 6 and 200 characters long");

            RuleFor(v => v.Username)
                .MinimumLength(3)
                .MaximumLength(30)
                .NotEmpty()
                .WithMessage("Username must be between 3 and 30 characters long");

            RuleFor(c => c.Username).Must(NotExist).WithMessage("Not a valid request");

            RuleFor(v => v.Email)
                .MinimumLength(5)
                .MaximumLength(200)
                .NotEmpty()
                .WithMessage("Must be a valid email");

            RuleFor(c => c.Email).Must(ValidEmail).WithMessage("Not a valid email");
            RuleFor(c => c.Email).Must(EmailNotExist).WithMessage("Email already used");
        }

        private bool ValidEmail(string email)
        {
            try
            {
                var mail = new MailAddress(email);
                return mail.Address == email;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private bool EmailNotExist(string email)
        {
            return _documentSession.Query<User>().SingleOrDefault(u => u.Email == email) is null;
        }

        private bool NotExist(string username)
        {
            return _documentSession.Query<User>().SingleOrDefault(u => u.Username == username) is null;
        }
    }
}