param(
  [string]$Source = 'D:\software\Bilight',
  [string]$Destination = 'D:\Antigravity-work\Bilight-v0.1.4-Windows-x64.zip'
)
if (Test-Path $Destination) {
  Remove-Item $Destination -Force
}
Compress-Archive -Path $Source -DestinationPath $Destination -CompressionLevel Optimal
$size = [math]::Round(((Get-Item $Destination).Length / 1MB), 2)
Write-Output "Zip generated: $Destination ($size MB)"
