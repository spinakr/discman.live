using FluentValidation;
using Marten;
using System.Linq;

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
        }
        
        private bool NotExist(string username)
        {
            return _documentSession.Query<User>().SingleOrDefault(u => u.Username == username) is null;
        }
    }
}