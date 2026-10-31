using System;
using System.Diagnostics;
using System.IO;

class Program {
    [STAThread]
    static void Main(string[] args) {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string target = Path.Combine(baseDir, "core", "Bilight.exe");
        if (!File.Exists(target)) {
            target = Path.Combine(baseDir, "Bilight-core.exe");
        }
        if (!File.Exists(target)) {
            target = Path.Combine(baseDir, "Bilight.exe");
        }
        if (File.Exists(target)) {
            ProcessStartInfo psi = new ProcessStartInfo(target);
            psi.WorkingDirectory = Path.GetDirectoryName(target);
            psi.Arguments = string.Join(" ", args);
            psi.UseShellExecute = true;
            Process.Start(psi);
        }
    }
}
