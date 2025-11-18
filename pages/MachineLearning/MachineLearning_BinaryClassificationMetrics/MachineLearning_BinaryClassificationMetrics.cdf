(* Content-type: application/vnd.wolfram.cdf.text *)

(*** Wolfram CDF File ***)
(* http://www.wolfram.com/cdf *)

(* CreatedBy='Mathematica 13.2' *)

(***************************************************************************)
(*                                                                         *)
(*                                                                         *)
(*  Under the Wolfram FreeCDF terms of use, this file and its content are  *)
(*  bound by the Creative Commons BY-SA Attribution-ShareAlike license.    *)
(*                                                                         *)
(*        For additional information concerning CDF licensing, see:        *)
(*                                                                         *)
(*         www.wolfram.com/cdf/adopting-cdf/licensing-options.html         *)
(*                                                                         *)
(*                                                                         *)
(***************************************************************************)

(*CacheID: 234*)
(* Internal cache information:
NotebookFileLineBreakTest
NotebookFileLineBreakTest
NotebookDataPosition[      1088,         20]
NotebookDataLength[     22298,        509]
NotebookOptionsPosition[     22522,        501]
NotebookOutlinePosition[     22918,        517]
CellTagsIndexPosition[     22875,        514]
WindowFrame->Normal*)

(* Beginning of Notebook Content *)
Notebook[{

Cell[CellGroupData[{
Cell["AUC for ROC Curve", "Section",
 CellChangeTimes->{{3.972378434221078*^9, 3.972378452047516*^9}, {
   3.972378533348455*^9, 3.97237882535714*^9}, {3.972379046624333*^9, 
   3.9723790754687223`*^9}, {3.9723792086444063`*^9, 3.972379369151352*^9}, {
   3.972379436865303*^9, 3.9723794756992083`*^9}, {3.972379615790298*^9, 
   3.972379637010727*^9}, {3.972379756483341*^9, 3.9723798565182*^9}, {
   3.972381007258726*^9, 3.972381009350279*^9}, {3.972382106013206*^9, 
   3.972382107694718*^9}, {3.97238239836755*^9, 3.972382404991707*^9}, {
   3.972383014929956*^9, 3.9723830407174788`*^9}, {3.972383381716024*^9, 
   3.972383382307942*^9}, {3.9723847527333307`*^9, 3.9723847558942003`*^9}, {
   3.972385094194455*^9, 3.972385098702652*^9}, {3.9723852067839823`*^9, 
   3.972385269437348*^9}, {3.972386950366199*^9, 3.972387002117462*^9}, 
   3.97242157120182*^9, {3.972421606250546*^9, 
   3.972421625213224*^9}},ExpressionUUID->"589336a5-3165-45c7-9595-\
d4fb2ff1498b"],

Cell[BoxData[
 RowBox[{"\[IndentingNewLine]", 
  RowBox[{
   RowBox[{
    RowBox[{"color", "[", "label_", "]"}], ":=", 
    RowBox[{"If", "[", 
     RowBox[{
      RowBox[{"label", "==", "0"}], ",", "Red", ",", 
      RowBox[{"Darker", "@", "Green"}]}], "]"}]}], "\[IndentingNewLine]", 
   "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{"predictor", "[", 
     RowBox[{"labels_", ",", "maxOffset_"}], "]"}], ":=", 
    RowBox[{"Module", "[", 
     RowBox[{
      RowBox[{"{", 
       RowBox[{"offsets", ",", "predictions"}], "}"}], ",", 
      "\[IndentingNewLine]", 
      RowBox[{
       RowBox[{"offsets", "=", 
        RowBox[{
         RowBox[{
          RowBox[{"maxOffset", "*", 
           RowBox[{"RandomReal", "[", "]"}]}], "&"}], "/@", "labels"}]}], ";",
        "\[IndentingNewLine]", 
       RowBox[{"predictions", "=", 
        RowBox[{"MapThread", "[", 
         RowBox[{
          RowBox[{
           RowBox[{"If", "[", 
            RowBox[{
             RowBox[{"#1", "==", "0"}], ",", 
             RowBox[{"#1", "+", "#2"}], ",", 
             RowBox[{"#1", "-", "#2"}]}], "]"}], "&"}], ",", 
          RowBox[{"{", 
           RowBox[{"labels", ",", "offsets"}], "}"}]}], "]"}]}], ";", 
       "\[IndentingNewLine]", "predictions"}]}], "\[IndentingNewLine]", 
     "]"}]}], "\[IndentingNewLine]", "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{"applyThreshold", "[", 
     RowBox[{"probability_", ",", "threshold_"}], "]"}], ":=", 
    RowBox[{"If", "[", 
     RowBox[{
      RowBox[{"probability", ">=", "threshold"}], ",", "1", ",", "0"}], 
     "]"}]}], "\[IndentingNewLine]", "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{"truePositiveRate", "[", 
     RowBox[{"labels_", ",", "probabilities_", ",", "threshold_"}], "]"}], ":=", 
    RowBox[{"Module", "[", 
     RowBox[{
      RowBox[{"{", 
       RowBox[{"predictions", ",", "truePositives", ",", "falseNegatives"}], 
       "}"}], ",", "\[IndentingNewLine]", 
      RowBox[{
       RowBox[{"predictions", "=", 
        RowBox[{
         RowBox[{
          RowBox[{"applyThreshold", "[", 
           RowBox[{"#", ",", "threshold"}], "]"}], "&"}], "/@", 
         "probabilities"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"truePositives", "=", 
        RowBox[{"Count", "[", 
         RowBox[{
          RowBox[{"MapThread", "[", 
           RowBox[{
            RowBox[{
             RowBox[{
              RowBox[{"#1", "==", "1"}], "&&", 
              RowBox[{"#2", "==", "1"}]}], "&"}], ",", 
            RowBox[{"{", 
             RowBox[{"labels", ",", "predictions"}], "}"}]}], "]"}], ",", 
          "True"}], "]"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"falseNegatives", "=", 
        RowBox[{"Count", "[", 
         RowBox[{
          RowBox[{"MapThread", "[", 
           RowBox[{
            RowBox[{
             RowBox[{
              RowBox[{"#1", "==", "1"}], "&&", 
              RowBox[{"#2", "==", "0"}]}], "&"}], ",", 
            RowBox[{"{", 
             RowBox[{"labels", ",", "predictions"}], "}"}]}], "]"}], ",", 
          "True"}], "]"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{
        RowBox[{"truePositives", "/", 
         RowBox[{"(", 
          RowBox[{"truePositives", "+", "falseNegatives"}], ")"}]}], "//", 
        "N"}]}]}], "\[IndentingNewLine]", "]"}]}], "\[IndentingNewLine]", 
   "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{"falsePositiveRate", "[", 
     RowBox[{"labels_", ",", "probabilities_", ",", "threshold_"}], "]"}], ":=", 
    RowBox[{"Module", "[", 
     RowBox[{
      RowBox[{"{", 
       RowBox[{"predictions", ",", "falsePositives", ",", "trueNegatives"}], 
       "}"}], ",", "\[IndentingNewLine]", 
      RowBox[{
       RowBox[{"predictions", "=", 
        RowBox[{
         RowBox[{
          RowBox[{"applyThreshold", "[", 
           RowBox[{"#", ",", "threshold"}], "]"}], "&"}], "/@", 
         "probabilities"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"falsePositives", "=", 
        RowBox[{"Count", "[", 
         RowBox[{
          RowBox[{"MapThread", "[", 
           RowBox[{
            RowBox[{
             RowBox[{
              RowBox[{"#1", "==", "0"}], "&&", 
              RowBox[{"#2", "==", "1"}]}], "&"}], ",", 
            RowBox[{"{", 
             RowBox[{"labels", ",", "predictions"}], "}"}]}], "]"}], ",", 
          "True"}], "]"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"trueNegatives", "=", 
        RowBox[{"Count", "[", 
         RowBox[{
          RowBox[{"MapThread", "[", 
           RowBox[{
            RowBox[{
             RowBox[{
              RowBox[{"#1", "==", "0"}], "&&", 
              RowBox[{"#2", "==", "0"}]}], "&"}], ",", 
            RowBox[{"{", 
             RowBox[{"labels", ",", "predictions"}], "}"}]}], "]"}], ",", 
          "True"}], "]"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{
        RowBox[{"falsePositives", "/", 
         RowBox[{"(", 
          RowBox[{"falsePositives", "+", "trueNegatives"}], ")"}]}], "//", 
        "N"}]}]}], "\[IndentingNewLine]", "]"}]}], "\[IndentingNewLine]", 
   "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{
     RowBox[{"plotLabel", "[", "n_", "]"}], ":=", 
     RowBox[{"Style", "[", 
      RowBox[{
       RowBox[{"\"\<Threshold: \>\"", "<>", 
        RowBox[{"StringPadLeft", "[", 
         RowBox[{
          RowBox[{"ToString", "[", "n", "]"}], ",", "4", ",", "\"\< \>\""}], 
         "]"}]}], ",", 
       RowBox[{"FontSize", "->", "14"}]}], "]"}]}], ";"}], 
   "\[IndentingNewLine]", "\[IndentingNewLine]", "\[IndentingNewLine]", 
   RowBox[{
    RowBox[{"tutorialROC", "[", 
     RowBox[{"size_", ",", "maxOffset_"}], "]"}], ":=", 
    RowBox[{"Module", "[", 
     RowBox[{
      RowBox[{"{", 
       RowBox[{
       "labels", ",", "probabilities", ",", "colors", ",", "points", ",", 
        "thresholds", ",", "tpr", ",", "fpr", ",", "plotData", ",", 
        "predictions", ",", "plot"}], "}"}], ",", "\[IndentingNewLine]", 
      "\[IndentingNewLine]", 
      RowBox[{
       RowBox[{"labels", "=", 
        RowBox[{"RandomChoice", "[", 
         RowBox[{
          RowBox[{"{", 
           RowBox[{"0", ",", "1"}], "}"}], ",", "size"}], "]"}]}], ";", 
       "\[IndentingNewLine]", 
       RowBox[{"probabilities", "=", 
        RowBox[{"predictor", "[", 
         RowBox[{"labels", ",", "maxOffset"}], "]"}]}], ";", 
       "\[IndentingNewLine]", 
       RowBox[{"colors", "=", 
        RowBox[{"color", "/@", "labels"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"points", "=", 
        RowBox[{
         RowBox[{
          RowBox[{"{", 
           RowBox[{"#", ",", 
            RowBox[{"RandomReal", "[", "]"}]}], "}"}], "&"}], "/@", 
         "probabilities"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"thresholds", "=", 
        RowBox[{"Range", "[", 
         RowBox[{"0", ",", "1", ",", "0.01"}], "]"}]}], ";", 
       "\[IndentingNewLine]", "\[IndentingNewLine]", 
       RowBox[{"tpr", "=", 
        RowBox[{
         RowBox[{
          RowBox[{"truePositiveRate", "[", 
           RowBox[{"labels", ",", "probabilities", ",", "#"}], "]"}], "&"}], "/@",
          "thresholds"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"fpr", "=", 
        RowBox[{
         RowBox[{
          RowBox[{"falsePositiveRate", "[", 
           RowBox[{"labels", ",", "probabilities", ",", "#"}], "]"}], "&"}], "/@",
          "thresholds"}]}], ";", "\[IndentingNewLine]", 
       RowBox[{"(*", 
        RowBox[{
         RowBox[{"auc", "=", 
          RowBox[{"Integrate", "[", 
           RowBox[{
            RowBox[{
             RowBox[{"Interpolation", "[", 
              RowBox[{
               RowBox[{"MapThread", "[", 
                RowBox[{
                 RowBox[{
                  RowBox[{"{", 
                   RowBox[{"#1", ",", "#2"}], "}"}], "&"}], ",", 
                 RowBox[{"{", 
                  RowBox[{"fpr", ",", "tpr"}], "}"}]}], "]"}], ",", 
               RowBox[{"InterpolationOrder", "->", "1"}]}], "]"}], "[", "x", 
             "]"}], ",", 
            RowBox[{"{", 
             RowBox[{"x", ",", "0", ",", "1"}], "}"}]}], "]"}]}], ";"}], 
        "*)"}], "\[IndentingNewLine]", 
       RowBox[{"plotData", "=", 
        RowBox[{"MapThread", "[", 
         RowBox[{
          RowBox[{
           RowBox[{"{", 
            RowBox[{"#1", ",", "#2"}], "}"}], "&"}], ",", 
          RowBox[{"{", 
           RowBox[{"fpr", ",", "tpr"}], "}"}]}], "]"}]}], ";", 
       "\[IndentingNewLine]", "\[IndentingNewLine]", 
       RowBox[{"plot", "=", 
        RowBox[{"Manipulate", "[", "\[IndentingNewLine]", 
         RowBox[{
          RowBox[{"Module", "[", 
           RowBox[{
            RowBox[{"{", 
             RowBox[{"plotPredictions", ",", "plotROC"}], "}"}], ",", 
            "\[IndentingNewLine]", 
            RowBox[{
             RowBox[{"plotPredictions", "=", 
              RowBox[{"Graphics", "[", 
               RowBox[{
                RowBox[{"{", "\[IndentingNewLine]", 
                 RowBox[{
                  RowBox[{"MapThread", "[", 
                   RowBox[{
                    RowBox[{
                    RowBox[{"{", 
                    RowBox[{
                    RowBox[{"Hue", "[", "#1", "]"}], ",", 
                    RowBox[{"Point", "[", "#2", "]"}]}], "}"}], "&"}], ",", 
                    RowBox[{"{", 
                    RowBox[{"colors", ",", "points"}], "}"}]}], "]"}], ",", 
                  "\[IndentingNewLine]", 
                  RowBox[{"InfiniteLine", "[", 
                   RowBox[{"{", 
                    RowBox[{
                    RowBox[{"{", 
                    RowBox[{
                    RowBox[{"thresholds", "[", 
                    RowBox[{"[", "n", "]"}], "]"}], ",", "0"}], "}"}], ",", 
                    RowBox[{"{", 
                    RowBox[{
                    RowBox[{"thresholds", "[", 
                    RowBox[{"[", "n", "]"}], "]"}], ",", "1"}], "}"}]}], 
                    "}"}], "]"}]}], "\[IndentingNewLine]", "}"}], ",", 
                RowBox[{"PlotRange", "->", 
                 RowBox[{"{", 
                  RowBox[{
                   RowBox[{"{", 
                    RowBox[{
                    RowBox[{"-", "0.1"}], ",", "1.1"}], "}"}], ",", 
                   RowBox[{"{", 
                    RowBox[{
                    RowBox[{"-", "0.1"}], ",", "1.1"}], "}"}]}], "}"}]}], ",", 
                RowBox[{"AspectRatio", "->", "0.25"}], ",", 
                RowBox[{"Frame", "->", "True"}], ",", 
                RowBox[{"FrameTicks", "->", 
                 RowBox[{"{", 
                  RowBox[{
                   RowBox[{"{", 
                    RowBox[{"None", ",", "None"}], "}"}], ",", 
                   RowBox[{"{", 
                    RowBox[{
                    RowBox[{"Range", "[", 
                    RowBox[{"0", ",", "1", ",", "0.1"}], "]"}], ",", 
                    RowBox[{"Range", "[", 
                    RowBox[{"0", ",", "1", ",", "0.1"}], "]"}]}], "}"}]}], 
                  "}"}]}], ",", 
                RowBox[{"ImageSize", "->", "400"}]}], "]"}]}], ";", 
             "\[IndentingNewLine]", 
             RowBox[{"plotROC", "=", 
              RowBox[{"ListLinePlot", "[", 
               RowBox[{
                RowBox[{"plotData", "[", 
                 RowBox[{"[", 
                  RowBox[{";;", "n"}], "]"}], "]"}], ",", 
                RowBox[{"(*", 
                 RowBox[{
                  RowBox[{"PlotLabel", "->", 
                   RowBox[{"plotLabel", "[", 
                    RowBox[{"thresholds", "[", 
                    RowBox[{"[", "n", "]"}], "]"}], "]"}]}], ","}], "*)"}], 
                RowBox[{"PlotRange", "->", 
                 RowBox[{"{", 
                  RowBox[{
                   RowBox[{"{", 
                    RowBox[{
                    RowBox[{"-", "0.1"}], ",", "1.1"}], "}"}], ",", 
                   RowBox[{"{", 
                    RowBox[{
                    RowBox[{"-", "0.1"}], ",", "1.1"}], "}"}]}], "}"}]}], ",", 
                RowBox[{"AspectRatio", "->", "1"}], ",", 
                RowBox[{"Frame", "->", "True"}], ",", 
                RowBox[{"FrameTicks", "->", "All"}], ",", 
                RowBox[{"Filling", "->", "Axis"}], ",", 
                RowBox[{"Prolog", "->", 
                 RowBox[{"{", 
                  RowBox[{"Red", ",", "Dashed", ",", 
                   RowBox[{"Line", "[", 
                    RowBox[{"{", 
                    RowBox[{
                    RowBox[{"{", 
                    RowBox[{"0", ",", "0"}], "}"}], ",", 
                    RowBox[{"{", 
                    RowBox[{"1", ",", "1"}], "}"}]}], "}"}], "]"}]}], "}"}]}],
                 ",", 
                RowBox[{"ImageSize", "->", "400"}]}], "]"}]}], ";", 
             "\[IndentingNewLine]", "\[IndentingNewLine]", 
             "\[IndentingNewLine]", 
             RowBox[{"Column", "[", 
              RowBox[{"{", 
               RowBox[{"plotPredictions", ",", "plotROC"}], "}"}], "]"}]}]}], 
           "\[IndentingNewLine]", "]"}], ",", "\[IndentingNewLine]", 
          RowBox[{"{", 
           RowBox[{"n", ",", "1", ",", 
            RowBox[{"Length", "@", "plotData"}], ",", "1"}], "}"}]}], "]"}]}],
        ";", "\[IndentingNewLine]", "\[IndentingNewLine]", "plot"}]}], 
     "\[IndentingNewLine]", "]"}]}], "\[IndentingNewLine]"}]}]], "Input",
 CellChangeTimes->{{3.972379658854576*^9, 3.9723797297218637`*^9}, {
   3.972379869706682*^9, 3.9723798815522757`*^9}, {3.972380345242882*^9, 
   3.97238037178286*^9}, {3.972381025978922*^9, 3.972381091177862*^9}, {
   3.97238211354277*^9, 3.972382125561748*^9}, {3.972382327605431*^9, 
   3.972382365477618*^9}, {3.972382409164331*^9, 3.972382412441288*^9}, {
   3.9723825262198267`*^9, 3.972382633469844*^9}, {3.972382974787302*^9, 
   3.9723829907843313`*^9}, {3.972383099223349*^9, 3.972383129089773*^9}, {
   3.972383220563562*^9, 3.972383286568077*^9}, {3.972383323972321*^9, 
   3.972383355250824*^9}, {3.972383394813047*^9, 3.972383397775384*^9}, {
   3.972383439599749*^9, 3.972383555228196*^9}, {3.9723836273688927`*^9, 
   3.972383628917845*^9}, {3.972383676191963*^9, 3.972383691047468*^9}, {
   3.972383754473102*^9, 3.9723841671222477`*^9}, {3.972384235533597*^9, 
   3.972384261502328*^9}, {3.972384293585043*^9, 3.97238433145678*^9}, {
   3.972384452972282*^9, 3.9723844572433767`*^9}, {3.972384533771563*^9, 
   3.97238453649343*^9}, {3.972384640002605*^9, 3.9723847468421183`*^9}, {
   3.972384830003244*^9, 3.972384830279175*^9}, {3.9723849572013893`*^9, 
   3.9723850647153263`*^9}, {3.972385126276391*^9, 3.972385163331491*^9}, {
   3.9723852891380863`*^9, 3.9723853032596893`*^9}, {3.9723854090111217`*^9, 
   3.972385434324319*^9}, {3.972385464967144*^9, 3.9723855032420187`*^9}, {
   3.97238573932327*^9, 3.9723858301377573`*^9}, {3.972385875635002*^9, 
   3.972385888869142*^9}, {3.9723859203837023`*^9, 3.972386092816311*^9}, {
   3.972386664247682*^9, 3.972386682136806*^9}, {3.972386982869595*^9, 
   3.972386999836731*^9}, {3.9723870538418713`*^9, 3.972387066433366*^9}, {
   3.972421573179655*^9, 3.972421598141046*^9}, {3.972421711818647*^9, 
   3.972421732990703*^9}, {3.972421819363289*^9, 3.972421836955068*^9}, {
   3.972421933692802*^9, 3.972422137196291*^9}, {3.9724222454851103`*^9, 
   3.972422245683037*^9}, {3.972422287402815*^9, 3.972422361457453*^9}, {
   3.972422426338031*^9, 3.972422494985532*^9}, {3.972422531789914*^9, 
   3.97242276587385*^9}, {3.972423312417102*^9, 3.972423350221869*^9}, {
   3.9724233955161867`*^9, 3.972423397003747*^9}, {3.9724234457011833`*^9, 
   3.9724235940880947`*^9}, {3.972423651818492*^9, 3.972423662380406*^9}, {
   3.97242386833405*^9, 3.9724239565504503`*^9}, {3.972424039635639*^9, 
   3.9724240518002853`*^9}, {3.972424820017056*^9, 3.972424820329904*^9}, {
   3.9724248523606997`*^9, 3.972424872911419*^9}, 3.97242518611843*^9, {
   3.9724252920035563`*^9, 3.972425409054912*^9}, {3.9724254809065247`*^9, 
   3.972425485102364*^9}, {3.97242570632868*^9, 3.972425713803372*^9}, {
   3.972425755508935*^9, 3.972425767883028*^9}, {3.9724259778655357`*^9, 
   3.972426053239108*^9}, {3.972426141625345*^9, 3.972426320613995*^9}, {
   3.972426402310734*^9, 3.9724264379230433`*^9}, {3.972426695680209*^9, 
   3.972426801854884*^9}, {3.972426866746729*^9, 3.972426900631777*^9}, {
   3.9724270190158587`*^9, 3.972427020570025*^9}, {3.972427063356485*^9, 
   3.972427095628474*^9}, {3.97242729486423*^9, 3.972427325902018*^9}, {
   3.9724860589505444`*^9, 3.972486062302724*^9}},
 CellLabel->"In[9]:=",ExpressionUUID->"8baf8595-afab-4a38-a77b-4e39443e62dc"],

Cell[CellGroupData[{

Cell[BoxData[
 RowBox[{"tutorialROC", "[", 
  RowBox[{"2000", ",", "0.4"}], "]"}]], "Input",
 CellChangeTimes->{{3.9724274717202063`*^9, 3.972427486670887*^9}, 
   3.972427583962866*^9, 3.972427633899692*^9, 3.9724276753161907`*^9, {
   3.972427720351698*^9, 3.972427816400992*^9}, {3.9724278542219152`*^9, 
   3.972427856005108*^9}},
 CellLabel->"In[16]:=",ExpressionUUID->"6dba7b7d-1a11-4985-8fa4-7798db3c8682"],

Cell[BoxData[
 TagBox[
  StyleBox[
   DynamicModuleBox[{$CellContext`n$$ = 101, Typeset`show$$ = True, 
    Typeset`bookmarkList$$ = {}, Typeset`bookmarkMode$$ = "Menu", 
    Typeset`animator$$, Typeset`animvar$$ = 1, Typeset`name$$ = 
    "\"untitled\"", Typeset`specs$$ = {{
      Hold[$CellContext`n$$], 1, 101, 1}}, Typeset`size$$ = {
    400., {265.134033203125, 270.865966796875}}, Typeset`update$$ = 0, 
    Typeset`initDone$$, Typeset`skipInitDone$$ = True}, 
    DynamicBox[Manipulate`ManipulateBoxes[
     1, StandardForm, "Variables" :> {$CellContext`n$$ = 1}, 
      "ControllerVariables" :> {}, 
      "OtherVariables" :> {
       Typeset`show$$, Typeset`bookmarkList$$, Typeset`bookmarkMode$$, 
        Typeset`animator$$, Typeset`animvar$$, Typeset`name$$, 
        Typeset`specs$$, Typeset`size$$, Typeset`update$$, Typeset`initDone$$,
         Typeset`skipInitDone$$}, "Body" :> 
      Module[{$CellContext`plotPredictions$, $CellContext`plotROC$}, \
$CellContext`plotPredictions$ = Graphics[{
            MapThread[{
              Hue[#], 
              
              Point[#2]}& , {$CellContext`colors$20675, \
$CellContext`points$20675}], 
            InfiniteLine[{{
               Part[$CellContext`thresholds$20675, $CellContext`n$$], 0}, {
               Part[$CellContext`thresholds$20675, $CellContext`n$$], 1}}]}, 
           PlotRange -> {{-0.1, 1.1}, {-0.1, 1.1}}, AspectRatio -> 0.25, 
           Frame -> True, FrameTicks -> {{None, None}, {
              Range[0, 1, 0.1], 
              Range[0, 1, 0.1]}}, ImageSize -> 400]; $CellContext`plotROC$ = 
         ListLinePlot[
           Part[$CellContext`plotData$20675, 
            Span[1, $CellContext`n$$]], 
           PlotRange -> {{-0.1, 1.1}, {-0.1, 1.1}}, AspectRatio -> 1, Frame -> 
           True, FrameTicks -> All, Filling -> Axis, Prolog -> {Red, Dashed, 
             Line[{{0, 0}, {1, 1}}]}, ImageSize -> 400]; 
        Column[{$CellContext`plotPredictions$, $CellContext`plotROC$}]], 
      "Specifications" :> {{$CellContext`n$$, 1, 101, 1}}, "Options" :> {}, 
      "DefaultOptions" :> {}],
     ImageSizeCache->{444., {311., 317.}},
     SingleEvaluation->True],
    Deinitialization:>None,
    DynamicModuleValues:>{},
    SynchronousInitialization->True,
    UndoTrackedVariables:>{Typeset`show$$, Typeset`bookmarkMode$$},
    UnsavedVariables:>{Typeset`initDone$$},
    UntrackedVariables:>{Typeset`size$$}], "Manipulate",
   Deployed->True,
   StripOnInput->False],
  Manipulate`InterpretManipulate[1]]], "Output",
 CellChangeTimes->{{3.9724272994677887`*^9, 3.972427328261932*^9}, {
   3.972427474567685*^9, 3.9724274878766193`*^9}, 3.9724275853550367`*^9, 
   3.972427635957391*^9, 3.972427677464069*^9, {3.972427722031186*^9, 
   3.972427817548978*^9}, 3.972427856952743*^9, 3.972429510380393*^9, {
   3.972429553063856*^9, 3.972429594472835*^9}, {3.972486038150676*^9, 
   3.972486063809298*^9}},
 CellLabel->"Out[16]=",ExpressionUUID->"a3d46fd8-f61c-4ebb-9281-56aaabc95059"]
}, Open  ]]
}, Open  ]]
},
WindowSize->{Full, Full},
WindowMargins->{{4, Automatic}, {Automatic, 4}},
FrontEndVersion->"13.2 for Mac OS X ARM (64-bit) (January 30, 2023)",
StyleDefinitions->"Default.nb",
ExpressionUUID->"6d36b9b5-70c5-4bde-997d-c77fde291e52"
]
(* End of Notebook Content *)

(* Internal cache information *)
(*CellTagsOutline
CellTagsIndex->{}
*)
(*CellTagsIndex
CellTagsIndex->{}
*)
(*NotebookFileOutline
Notebook[{
Cell[CellGroupData[{
Cell[1510, 35, 974, 14, 67, "Section",ExpressionUUID->"589336a5-3165-45c7-9595-d4fb2ff1498b"],
Cell[2487, 51, 16580, 375, 1228, "Input",ExpressionUUID->"8baf8595-afab-4a38-a77b-4e39443e62dc"],
Cell[CellGroupData[{
Cell[19092, 430, 413, 7, 30, "Input",ExpressionUUID->"6dba7b7d-1a11-4985-8fa4-7798db3c8682"],
Cell[19508, 439, 2986, 58, 670, "Output",ExpressionUUID->"a3d46fd8-f61c-4ebb-9281-56aaabc95059"]
}, Open  ]]
}, Open  ]]
}
]
*)

(* End of internal cache information *)

(* NotebookSignature xvDNveymmMGrED14mSCvQiDh *)
