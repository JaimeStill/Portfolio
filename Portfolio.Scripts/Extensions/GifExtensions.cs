using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Threading.Tasks;

namespace Portfolio.Scripts.Extensions
{
    public static class GifExtensions
    {
        public static List<string> GetFlagOptions() => new List<string>
        {
            "fast_bilinear",
            "bilinear",
            "bicubic",
            "experimental",
            "neighbor",
            "area",
            "bicublin",
            "gauss",
            "sinc",
            "lanczos",
            "spline",
            "print_info",
            "accurate_rnd",
            "full_chroma_int",
            "full_chroma_inp",
            "bitexact"
        };

        public static List<string> GetLogOptions() => new List<string>
        {
            "quiet",
            "panic",
            "fatal"
        };

        public static async Task<Command> GenerateGifScript(this GifOptions model)
        {
            var script = await (".Scripts.Create-Gif.ps1").GetTextFromEmbeddedResource();

            Command createGif = new Command(script, true);
            createGif.Parameters.Add("exec", model.Exec);
            createGif.Parameters.Add("origin", model.Origin);
            createGif.Parameters.Add("destination", model.Destination);
            createGif.Parameters.Add("temp", model.Temp);
            createGif.Parameters.Add("fps", model.Fps);
            createGif.Parameters.Add("scale", model.Scale);
            createGif.Parameters.Add("flags", model.Flags);
            createGif.Parameters.Add("log", model.Log);

            return createGif;
        }

        public static async Task<ConsoleOutput> ConvertToGif(this GifOptions model)
        {
            var script = await model.GenerateGifScript();
            var output = await script.ExecuteCommand();

            if (!output.HasError)
            {
                output.Result = $"{model.Destination.Split('/').Last()} successfully created";
            }

            return output;
        }
    }
}