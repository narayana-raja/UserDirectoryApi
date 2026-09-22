using System.ComponentModel.DataAnnotations;

namespace UserDirectoryApi.DTOs
{
    public class UpdateUserRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 120)]
        public int Age { get; set; }

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(10, MinimumLength = 4)]
        public string Pincode { get; set; } = string.Empty;
    }
}
