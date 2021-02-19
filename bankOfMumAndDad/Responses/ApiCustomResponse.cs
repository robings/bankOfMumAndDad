using System;
using bankOfMumAndDad.Entities;

namespace bankOfMumAndDad.Responses
{
    public class ApiCustomResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public TransactionsDTO Data { get; set; }

        public ApiCustomResponse(bool success, string message, TransactionsDTO data)
        {
            Success = success;
            Message = message;
            Data = data;
        }
    }
}
